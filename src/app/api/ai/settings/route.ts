import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getAiSettings, saveAiSettings, maskApiKey, type AiProvider } from "@/lib/ai-providers";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await getAiSettings();
  return NextResponse.json({
    provider: settings.provider,
    apiKey: maskApiKey(settings.apiKey),
    apiKeySet: !!settings.apiKey,
    baseUrl: settings.baseUrl,
    model: settings.model,
  });
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { provider, apiKey, baseUrl, model } = body;

  const validProviders: AiProvider[] = ["ollama", "openai", "claude", "google"];
  if (!validProviders.includes(provider)) {
    return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
  }

  await saveAiSettings({
    provider,
    apiKey: apiKey || null,
    baseUrl: baseUrl || null,
    model: model || undefined,
  });

  return NextResponse.json({ success: true });
}
