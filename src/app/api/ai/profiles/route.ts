import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getAllProfiles, createProfile, maskApiKey, type AiProvider } from "@/lib/ai-providers";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profiles = await getAllProfiles();
  return NextResponse.json(
    profiles.map((p) => ({
      id: p.id,
      name: p.name,
      provider: p.provider,
      apiKey: maskApiKey(p.apiKey),
      apiKeySet: !!p.apiKey,
      baseUrl: p.baseUrl,
      model: p.model,
      isDefault: p.isDefault,
    }))
  );
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, provider, apiKey, baseUrl, model } = body;

  if (!name) {
    return NextResponse.json({ error: "Profile name is required" }, { status: 400 });
  }

  const validProviders: AiProvider[] = ["ollama", "openai", "claude", "google"];
  if (provider && !validProviders.includes(provider)) {
    return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
  }

  try {
    const profile = await createProfile({
      name,
      provider: provider || "ollama",
      apiKey,
      baseUrl,
      model,
    });

    return NextResponse.json({
      id: profile.id,
      name: profile.name,
      provider: profile.provider,
      apiKey: maskApiKey(profile.apiKey),
      apiKeySet: !!profile.apiKey,
      baseUrl: profile.baseUrl,
      model: profile.model,
      isDefault: profile.isDefault,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to create profile";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
