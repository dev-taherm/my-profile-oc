import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { updateProfile, deleteProfile, maskApiKey, type AiProvider } from "@/lib/ai-providers";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { name, provider, apiKey, baseUrl, model } = body;

  const validProviders: AiProvider[] = ["ollama", "openai", "claude", "google"];
  if (provider && !validProviders.includes(provider)) {
    return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
  }

  try {
    const profile = await updateProfile(id, {
      name,
      provider,
      // apiKey: only overwrite if explicitly provided in the request body
      apiKey: "apiKey" in body ? (apiKey || null) : undefined,
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
    const msg = err instanceof Error ? err.message : "Failed to update profile";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await deleteProfile(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to delete profile";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
