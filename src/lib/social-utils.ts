import { prisma } from "./prisma";
import { decryptToken } from "./social-crypto";

const TELEGRAM_API = "https://api.telegram.org";

// ─── Telegram Helpers ────────────────────────────────────────────

export async function sendToTelegram(
  chatId: string,
  botToken: string,
  message: string
): Promise<{ messageId: number }> {
  const url = `${TELEGRAM_API}/bot${botToken}/sendMessage`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: "HTML",
    }),
  });

  const data = await res.json();

  if (!data.ok) {
    throw new Error(data.description || "Telegram send failed");
  }

  return { messageId: data.result.message_id };
}

export async function sendPhotoToTelegram(
  chatId: string,
  botToken: string,
  photoUrl: string,
  caption: string
): Promise<{ messageId: number }> {
  // 1. Download image server-side
  const imageRes = await fetch(photoUrl);
  if (!imageRes.ok) {
    throw new Error(`Failed to download image: ${imageRes.status} ${imageRes.statusText}`);
  }
  const imageBuffer = await imageRes.arrayBuffer();
  const imageBlob = new Blob([imageBuffer]);

  // 2. Send photo with short caption (max 100 chars)
  const shortCaption = caption.length > 100
    ? caption.substring(0, 100).trim() + "..."
    : caption;

  const photoForm = new FormData();
  photoForm.append("chat_id", chatId);
  photoForm.append("photo", imageBlob, "post-image.jpg");
  photoForm.append("caption", shortCaption);
  photoForm.append("parse_mode", "HTML");

  const photoRes = await fetch(`${TELEGRAM_API}/bot${botToken}/sendPhoto`, {
    method: "POST",
    body: photoForm,
  });

  const photoData = await photoRes.json();

  if (!photoData.ok) {
    throw new Error(photoData.description || "Telegram sendPhoto failed");
  }

  // 3. Send full text as separate message
  const textRes = await fetch(`${TELEGRAM_API}/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: caption,
      parse_mode: "HTML",
    }),
  });

  const textData = await textRes.json();

  if (!textData.ok) {
    throw new Error(textData.description || "Telegram sendMessage failed");
  }

  return { messageId: textData.result.message_id };
}

export async function testTelegramConnection(
  botToken: string,
  chatId: string
): Promise<{ botName: string; chatValid: boolean }> {
  // Verify bot token
  const botRes = await fetch(`${TELEGRAM_API}/bot${botToken}/getMe`);
  const botData = await botRes.json();

  if (!botData.ok) {
    throw new Error("Invalid bot token");
  }

  // Test sending a message
  const testRes = await fetch(`${TELEGRAM_API}/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: "✅ Bot connected successfully! You will receive generated social media posts here.",
    }),
  });

  const testData = await testRes.json();

  if (!testData.ok) {
    throw new Error(`Bot token valid but cannot send to this chat: ${testData.description}`);
  }

  return { botName: botData.result.first_name, chatValid: true };
}

// ─── Account Management ──────────────────────────────────────────

export async function getTelegramConfig(): Promise<{
  botToken: string;
  chatId: string;
  botName: string;
} | null> {
  const account = await prisma.socialAccount.findFirst({
    where: { provider: "telegram" },
  });

  if (!account) return null;

  const botToken = decryptToken(account.accessToken);
  const chatId = account.providerAccountId;

  return { botToken, chatId, botName: account.name };
}

export async function saveTelegramConfig(
  botToken: string,
  chatId: string,
  botName: string
): Promise<void> {
  const existing = await prisma.socialAccount.findFirst({
    where: { provider: "telegram" },
  });

  const { encryptToken } = await import("./social-crypto");
  const encryptedToken = encryptToken(botToken);

  if (existing) {
    await prisma.socialAccount.update({
      where: { id: existing.id },
      data: {
        providerAccountId: chatId,
        name: botName,
        accessToken: encryptedToken,
        isActive: true,
      },
    });
  } else {
    await prisma.socialAccount.create({
      data: {
        provider: "telegram",
        providerAccountId: chatId,
        name: botName,
        accessToken: encryptedToken,
      },
    });
  }
}
