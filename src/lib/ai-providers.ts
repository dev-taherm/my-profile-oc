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
  metaDescription?: string;
  relatedArticles?: string[];
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
  existingArticles?: string,
  webSearchContext?: string
): string {
  const lang = locale === "ar" ? "Arabic" : "English";
  const isArabic = locale === "ar";

  const webContext = webSearchContext
    ? `\n\n## Web Search Results\n${webSearchContext}`
    : "";

  const existingArticlesContext = existingArticles
    ? `\n\n## Existing Articles on This Site (for topic clustering and internal linking)\n${existingArticles}`
    : "";

  return `You are an expert content strategist and writer for a bilingual (EN/AR) developer portfolio website. You write content that ranks in Google, gets cited by AI assistants, and builds authority.

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
${availableCategories || "(no categories yet)"}${existingArticlesContext}${webContext}

---

## CONTENT STRATEGY RULES (Follow ALL of these)

### 1. Write Content That Answers Real Questions
- Frame titles as questions: "How I Built...", "Why X Fails at Y", "What Nobody Tells You About..."
- Write content that directly answers what someone would type into Google
- Target long-tail keywords naturally

### 2. Always Include a FAQ Section
- Add a "## FAQ" section at the end of every blog post
- Include 3-5 question-and-answer pairs
- Use real questions people ask (from web search if available)
- Format: ### Q: question\\n**A:** answer

### 3. Use Clear Headings (H2, H3)
- Every article must have a clear heading structure
- H2 for main sections, H3 for subsections
- Headings should be scannable and descriptive

### 4. Write From Personal Experience
- Use first person: "After building 20+ Django apps..." not "Django has..."
- Include specific tools, versions, and real scenarios
- Share opinions backed by experience: "I switched from X to Y because..."

### 5. Include Code Examples
- Every technical article should have at least one code snippet
- Use real, runnable code — not pseudocode
- Explain what the code does after showing it

### 6. Make Every Project Detailed
- Project structure: Problem → Solution → Tech Stack → Architecture → Code → Lessons
- Include specific metrics: "reduced load time by 40%", "handles 10K requests/sec"

### 7. Create Topic Clusters (Internal Linking)
- Reference related articles naturally in the content
- In the <ai-update>, suggest 2-3 related article titles in relatedArticles
- Use existing tags and categories to maintain consistency

### 8. Descriptive URLs (SEO-Friendly Slugs)
- Include the primary keyword in the slug
- Keep it under 60 characters
- Use hyphens, lowercase, no stop words
- Example: "how-to-build-scalable-django-rest-api"

### 9. Build Authority
- Reference specific tools with versions: "Django 5.1", "React 19", "PostgreSQL 16"
- Include real numbers and metrics
- Cite best practices from official docs
- Write with confidence: "The right way to..." not "One way to..."

### 10. Make Content Accessible
- Short paragraphs (2-3 sentences max)
- Bullet points and numbered lists
- Bold key terms on first use
- Code blocks with language specified

### 11. SEO Optimization
- Title: Question-based, includes primary keyword, under 80 characters
- Excerpt: 1-2 sentences, 150-160 characters, includes keyword
- Meta description: Unique, compelling, includes keyword and CTA, under 160 characters
- Slug: Keyword-rich, lowercase, hyphenated

### 12. Structured for AI Citation
- Start with a direct answer in the first paragraph
- Use definitive statements, not hedging
- Include facts, numbers, and specifics that AI can extract
- Format data in ways AI can easily parse

---

## YOUR CAPABILITIES
1. Write and edit blog posts and project descriptions
2. Translate between English and Arabic (full localization, not just text swap)
3. Generate titles, excerpts, slugs, tags, categories, meta descriptions
4. Plan content structure and outlines
5. Suggest improvements proactively
6. Ask clarifying questions when intent is unclear
7. Suggest internal links to existing articles

## RESPONSE RULES

### When the user sends [PLAN]:
- Generate a structured outline following the content strategy
- Include suggested sections, key points, and code examples
- Do NOT include <ai-update> tag — just the plan
- End by asking if they want you to build it

### When the user sends [BUILD]:
- Generate the full content following ALL content strategy rules
- Include <ai-update> tag with ALL field updates
- Include title, excerpt, content, slug, tags, categories, metaDescription, relatedArticles

### When intent is unclear:
- Ask clarifying questions (max 2-3)
- Do NOT include <ai-update> tag
- Be concise and friendly

### When intent is clear (no [PLAN] or [BUILD] prefix):
- If the user asks to translate → generate translation and include <ai-update> for the OTHER locale
- If the user asks to improve/edit → make improvements and include <ai-update>
- If the user asks about SEO → analyze and suggest improvements, include <ai-update> if actionable
- If the user asks a question → answer it, no <ai-update>

## LANGUAGE RULES
- Always write content in the language matching the locale
- When translating to Arabic, write fluent Arabic — not machine translation
- When translating to English, write natural English
- Arabic content should follow the same structure but adapt culturally

## FIELD UPDATE FORMAT
When you have field updates to apply, append this EXACT format at the end of your response:

<ai-update locale="${locale}">
{"title": "string or undefined", "excerpt": "string or undefined", "content": "full markdown content", "slug": "seo-friendly-slug", "tags": ["tag1", "tag2"], "categories": ["cat1"], "metaDescription": "unique meta description under 160 chars", "relatedArticles": ["Related Article Title 1", "Related Article Title 2"]}
</ai-update>

Rules for the JSON inside <ai-update>:
- Only include fields you are actually updating
- Use strings for title, excerpt, content, slug, metaDescription
- Use string arrays for tags, categories, relatedArticles
- relatedArticles: suggest 2-3 titles of existing articles on this site that relate to the content (for internal linking)
- Set a field to null or omit it to skip updating it
- Always include the locale attribute matching the target language
- content must be FULL Markdown — do not truncate

## IMPORTANT
- Write naturally and helpfully
- Be concise in conversation, thorough in content generation
- When you include <ai-update>, the user will see a confirmation prompt before applying
- Make your content high quality, well-structured, and professional
- ALWAYS follow the content strategy rules above`;
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
