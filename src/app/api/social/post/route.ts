import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { decryptToken } from "@/lib/social-crypto";
import { sendToTelegram, sendPhotoToTelegram } from "@/lib/social-utils";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { content, platform, tone, imageUrl } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: "content is required" },
        { status: 400 }
      );
    }

    const targetPlatform = platform === "facebook" ? "facebook" : "linkedin";
    const targetTone = ["professional", "viral", "mix"].includes(tone) ? tone : "professional";

    const account = await prisma.socialAccount.findFirst({
      where: { provider: "telegram", isActive: true },
    });

    if (!account) {
      return NextResponse.json(
        { error: "Telegram bot not configured. Go to Social Media settings to set it up." },
        { status: 404 }
      );
    }

    const botToken = decryptToken(account.accessToken);
    const chatId = account.providerAccountId;

    let result;
    if (imageUrl) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
      const fullUrl = imageUrl.startsWith("http") ? imageUrl : `${siteUrl}${imageUrl}`;
      result = await sendPhotoToTelegram(chatId, botToken, fullUrl, content);
    } else {
      result = await sendToTelegram(chatId, botToken, content);
    }

    const post = await prisma.socialPost.create({
      data: {
        content,
        imageUrl: imageUrl || null,
        platform: targetPlatform,
        tone: targetTone,
        status: "SENT",
        platformPostId: String(result.messageId),
        publishedAt: new Date(),
        accountId: account.id,
      },
    });

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
      recordId: post.id,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";

    // Re-parse failed — body already consumed above. Log error only.
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
