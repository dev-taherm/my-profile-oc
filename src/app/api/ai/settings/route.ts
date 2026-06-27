import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getTavilyKey, setTavilyKey, getActiveProfile, maskApiKey } from "@/lib/ai-providers";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tavilyKey = await getTavilyKey();
  const activeProfile = await getActiveProfile();

  return NextResponse.json({
    tavilyApiKey: maskApiKey(tavilyKey),
    tavilyKeySet: !!tavilyKey,
    activeProfileId: activeProfile.provider ? null : null, // client reads profiles separately
  });
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { tavilyApiKey } = body;

  // Only update Tavily key if explicitly provided
  if ("tavilyApiKey" in body) {
    await setTavilyKey(tavilyApiKey || null);
  }

  return NextResponse.json({ success: true });
}
