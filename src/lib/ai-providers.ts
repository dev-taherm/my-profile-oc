import { prisma } from "./prisma";

export type AiProvider = "ollama" | "openai" | "claude" | "google";

export interface AiSettingsData {
  provider: AiProvider;
  apiKey: string | null;
  baseUrl: string | null;
  model: string;
  tavilyApiKey: string | null;
}

export interface AiGenerateParams {
  prompt: string;
  systemPrompt: string;
  chatHistory?: { role: "user" | "assistant"; content: string }[];
}

export interface AiFieldUpdates {
  title?: string;
  excerpt?: string;
  content?: string;
  slug?: string;
  tags?: string[];
  categories?: string[];
}

export interface AiPendingUpdate {
  locale: "en" | "ar";
  fields: AiFieldUpdates;
}

const PROVIDER_DEFAULTS: Record<AiProvider, { baseUrl: string; model: string }> = {
  ollama: { baseUrl: "http://localhost:11434", model: "llama3" },
  openai: { baseUrl: "https://api.openai.com/v1", model: "gpt-3.5-turbo" },
  claude: { baseUrl: "https://api.anthropic.com", model: "claude-3-5-sonnet-20241022" },
  google: { baseUrl: "https://generativelanguage.googleapis.com/v1beta", model: "gemini-2.5-flash" },
};

export async function getAiSettings(): Promise<AiSettingsData> {
  const settings = await prisma.aiSettings.findUnique({ where: { id: "default" } });
  if (!settings) {
    return { provider: "ollama", apiKey: null, baseUrl: null, model: "llama3", tavilyApiKey: null };
  }
  return {
    provider: settings.provider as AiProvider,
    apiKey: settings.apiKey,
    baseUrl: settings.baseUrl,
    model: settings.model,
    tavilyApiKey: settings.tavilyApiKey,
  };
}

export async function saveAiSettings(data: AiSettingsData): Promise<void> {
  await prisma.aiSettings.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      provider: data.provider,
      apiKey: data.apiKey,
      baseUrl: data.baseUrl,
      model: data.model,
      tavilyApiKey: data.tavilyApiKey,
    },
    update: {
      provider: data.provider,
      apiKey: data.apiKey,
      baseUrl: data.baseUrl,
      model: data.model,
      tavilyApiKey: data.tavilyApiKey,
    },
  });
}

export function maskApiKey(key: string | null): string | null {
  if (!key) return null;
  if (key.length <= 8) return "****";
  return key.slice(0, 4) + "****" + key.slice(-4);
}

export function parseAiUpdate(text: string): {
  cleanText: string;
  update: AiPendingUpdate | null;
} {
  const match = text.match(/<ai-update\s+locale="(\w+)">([\s\S]*?)<\/ai-update>/);
  if (!match) return { cleanText: text, update: null };

  const cleanText = text.replace(match[0], "").trim();
  const locale = match[1] as "en" | "ar";

  try {
    const fields = JSON.parse(match[2]) as AiFieldUpdates;
    return { cleanText, update: { locale, fields } };
  } catch {
    return { cleanText: text, update: null };
  }
}

export function buildSystemPrompt(
  entityType: string,
  locale: string,
  title: string,
  excerpt: string,
  currentContent: string,
  availableTags: string,
  availableCategories: string,
  webSearchContext?: string
): string {
  const lang = locale === "ar" ? "Arabic" : "English";

  const webContext = webSearchContext
    ? `\n\n## Web Search Results\n${webSearchContext}`
    : "";

  return `You are an intelligent content agent for a bilingual (EN/AR) portfolio website.

## Current Entity
- Type: ${entityType === "blog" ? "Blog Post" : "Project"}
- Current locale: ${lang}
- Title (EN): "${locale === "en" ? title : "(see content below)"}"
- Title (AR): "${locale === "ar" ? title : "(see content below)"}"
- Excerpt: "${excerpt || "(none)"}"

## Current Content
${currentContent || "(empty)"}

## Available Tags (select from these when updating tags)
${availableTags || "(no tags yet)"}

## Available Categories (select from these when updating categories)
${availableCategories || "(no categories yet)"}${webContext}

## Your Capabilities
1. Write and edit blog posts and project descriptions
2. Translate between English and Arabic
3. Generate titles, excerpts, slugs, tags, categories
4. Optimize for SEO and GEO
5. Plan content structure and outlines
6. Ask clarifying questions when intent is unclear
7. Suggest improvements proactively

## Response Rules

### When the user sends [PLAN]:
- Generate a structured outline with sections and key points
- Do NOT include <ai-update> tag — just the plan
- End by asking if they want you to build it

### When the user sends [BUILD]:
- Generate the full content for all fields
- Include <ai-update> tag with ALL field updates
- Make sure to include title, excerpt, content, slug, tags, and categories

### When intent is unclear:
- Ask clarifying questions (max 2-3)
- Do NOT include <ai-update> tag
- Be concise and friendly

### When intent is clear (no [PLAN] or [BUILD] prefix):
- If the user asks to translate → generate translation and include <ai-update> for the OTHER locale
- If the user asks to improve/edit → make improvements and include <ai-update>
- If the user asks about SEO → analyze and suggest improvements, include <ai-update> if actionable
- If the user asks a question → answer it, no <ai-update>

### Language Rules:
- Always write content in the language matching the locale
- When translating to Arabic, write Arabic content
- When translating to English, write English content

### Field Update Format:
When you have field updates to apply, append this EXACT format at the end of your response:

<ai-update locale="en">
{"title": "string or undefined", "excerpt": "string or undefined", "content": "string or undefined", "slug": "string or undefined", "tags": ["tag1", "tag2"], "categories": ["cat1"]}
</ai-update>

Rules for the JSON inside <ai-update>:
- Only include fields you are actually updating
- Use strings for title, excerpt, content, slug
- Use string arrays for tags and categories (use names from Available Tags/Categories)
- Set a field to null or omit it to skip updating it
- Always include the locale attribute matching the target language

### Important:
- Write naturally and helpfully
- Be concise — don't repeat the full content back unless generating it
- When you include <ai-update>, the user will see a confirmation prompt before applying
- Make your content high quality, well-structured, and professional`;
}

export async function buildAiRequest(
  params: AiGenerateParams,
  overrideSettings?: AiSettingsData
): Promise<{ url: string; headers: Record<string, string>; body: object }> {
  const settings = overrideSettings || await getAiSettings();
  const provider = settings.provider;
  const baseUrl = settings.baseUrl || PROVIDER_DEFAULTS[provider].baseUrl;
  const model = settings.model || PROVIDER_DEFAULTS[provider].model;

  const messages: { role: string; content: string }[] = [
    { role: "system", content: params.systemPrompt },
  ];

  if (params.chatHistory) {
    for (const msg of params.chatHistory) {
      messages.push({ role: msg.role, content: msg.content });
    }
  }

  messages.push({ role: "user", content: params.prompt });

  switch (provider) {
    case "ollama":
      return {
        url: `${baseUrl}/api/chat`,
        headers: {
          "Content-Type": "application/json",
          ...(settings.apiKey ? { Authorization: `Bearer ${settings.apiKey}` } : {}),
        },
        body: {
          model,
          messages,
          stream: true,
        },
      };

    case "openai":
      return {
        url: `${baseUrl}/chat/completions`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${settings.apiKey}`,
        },
        body: {
          model,
          messages,
          stream: true,
        },
      };

    case "claude":
      return {
        url: `${baseUrl}/v1/messages`,
        headers: {
          "Content-Type": "application/json",
          "x-api-key": settings.apiKey || "",
          "anthropic-version": "2023-06-01",
        },
        body: {
          model,
          max_tokens: 8192,
          system: params.systemPrompt,
          messages: messages.filter((m) => m.role !== "system"),
          stream: true,
        },
      };

    case "google":
      return {
        url: `${baseUrl}/models/${model}:streamGenerateContent?alt=sse&key=${settings.apiKey}`,
        headers: { "Content-Type": "application/json" },
        body: {
          contents: messages
            .filter((m) => m.role !== "system")
            .map((m) => ({
              role: m.role === "assistant" ? "model" : "user",
              parts: [{ text: m.content }],
            })),
          systemInstruction: { parts: [{ text: params.systemPrompt }] },
        },
      };

    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

export function parseProviderChunk(
  provider: AiProvider,
  line: string
): string | null {
  if (!line || !line.startsWith("data: ")) return null;
  const data = line.slice(6).trim();
  if (data === "[DONE]") return null;

  try {
    const parsed = JSON.parse(data);

    switch (provider) {
      case "ollama":
        return parsed.message?.content || null;

      case "openai":
        return parsed.choices?.[0]?.delta?.content || null;

      case "claude":
        if (parsed.type === "content_block_delta") {
          return parsed.delta?.text || null;
        }
        return null;

      case "google":
        if (parsed.candidates?.[0]?.content?.parts?.[0]?.text) {
          return parsed.candidates[0].content.parts[0].text;
        }
        return null;

      default:
        return null;
    }
  } catch {
    return null;
  }
}
