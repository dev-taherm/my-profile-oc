import { prisma } from "./prisma";

export type AiProvider = "ollama" | "openai" | "claude" | "google";

export interface AiSettingsData {
  provider: AiProvider;
  apiKey: string | null;
  baseUrl: string | null;
  model: string;
}

export interface AiGenerateParams {
  prompt: string;
  systemPrompt: string;
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
    return { provider: "ollama", apiKey: null, baseUrl: null, model: "llama3" };
  }
  return {
    provider: settings.provider as AiProvider,
    apiKey: settings.apiKey,
    baseUrl: settings.baseUrl,
    model: settings.model,
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
    },
    update: {
      provider: data.provider,
      apiKey: data.apiKey,
      baseUrl: data.baseUrl,
      model: data.model,
    },
  });
}

export function maskApiKey(key: string | null): string | null {
  if (!key) return null;
  if (key.length <= 8) return "****";
  return key.slice(0, 4) + "****" + key.slice(-4);
}

export async function buildAiRequest(
  params: AiGenerateParams,
  overrideSettings?: AiSettingsData
): Promise<{ url: string; headers: Record<string, string>; body: object }> {
  const settings = overrideSettings || await getAiSettings();
  const provider = settings.provider;
  const baseUrl = settings.baseUrl || PROVIDER_DEFAULTS[provider].baseUrl;
  const model = settings.model || PROVIDER_DEFAULTS[provider].model;

  const messages = [
    { role: "system", content: params.systemPrompt },
    { role: "user", content: params.prompt },
  ];

  switch (provider) {
    case "ollama":
      return {
        url: `${baseUrl}/api/chat`,
        headers: { "Content-Type": "application/json" },
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
          max_tokens: 4096,
          system: params.systemPrompt,
          messages: [{ role: "user", content: params.prompt }],
          stream: true,
        },
      };

    case "google":
      return {
        url: `${baseUrl}/models/${model}:streamGenerateContent?alt=sse&key=${settings.apiKey}`,
        headers: { "Content-Type": "application/json" },
        body: {
          contents: [{ parts: [{ text: params.prompt }] }],
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
