import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { saveTelegramConfig, testTelegramConnection } from "@/lib/social-utils";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { botToken, chatId } = await request.json();

    if (!botToken || !chatId) {
      return NextResponse.json(
        { error: "botToken and chatId are required" },
        { status: 400 }
      );
    }

    // Test the connection first
    const result = await testTelegramConnection(botToken, chatId);

    // Save the config
    await saveTelegramConfig(botToken, chatId, result.botName);

    return NextResponse.json({ success: true, botName: result.botName });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
