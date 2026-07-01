import { prisma } from "./prisma";
import { decryptToken } from "./social-crypto";
import { request } from "./ipv4-fetch";

const TELEGRAM_API = "https://api.telegram.org";

// ─── IPv4-safe helpers ───────────────────────────────────────────

async function readJson(res: { body: ReadableStream<Uint8Array> }): Promise<any> {
  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  const text = new TextDecoder().decode(Buffer.concat(chunks.map((c) => Buffer.from(c))));
  return JSON.parse(text);
}

async function readBuffer(res: { body: ReadableStream<Uint8Array> }): Promise<Buffer> {
  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  return Buffer.concat(chunks.map((c) => Buffer.from(c)));
}

function buildMultipartBody(
  fields: Record<string, string>,
  fileField: string,
  fileBuffer: Buffer,
  fileName: string
): { body: Buffer; contentType: string } {
  const boundary = `----TGFormBoundary${Date.now()}`;
  const parts: Buffer[] = [];

  for (const [key, value] of Object.entries(fields)) {
    parts.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="${key}"\r\n\r\n${value}\r\n`));
  }

  parts.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="${fileField}"; filename="${fileName}"\r\nContent-Type: image/jpeg\r\n\r\n`));
  parts.push(fileBuffer);
  parts.push(Buffer.from(`\r\n--${boundary}--\r\n`));

  return {
    body: Buffer.concat(parts),
    contentType: `multipart/form-data; boundary=${boundary}`,
  };
}

// ─── Telegram Helpers ────────────────────────────────────────────

export async function sendToTelegram(
  chatId: string,
  botToken: string,
  message: string
): Promise<{ messageId: number }> {
  const url = `${TELEGRAM_API}/bot${botToken}/sendMessage`;

  const res = await request(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: "HTML",
    }),
  });

  const data = await readJson(res);

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
  // 1. Download image server-side (IPv4)
  const imageRes = await request(photoUrl, { method: "GET", timeout: 15000 });
  if (!imageRes.ok) {
    throw new Error(`Failed to download image: ${imageRes.status}`);
  }
  const imageBuffer = await readBuffer(imageRes);

  // 2. Send photo with short caption (max 100 chars)
  const shortCaption = caption.length > 100
    ? caption.substring(0, 100).trim() + "..."
    : caption;

  const { body: multipartBody, contentType } = buildMultipartBody(
    { chat_id: chatId, caption: shortCaption, parse_mode: "HTML" },
    "photo",
    imageBuffer,
    "post-image.jpg"
  );

  const photoRes = await request(`${TELEGRAM_API}/bot${botToken}/sendPhoto`, {
    method: "POST",
    headers: { "Content-Type": contentType },
    body: multipartBody,
  });

  const photoData = await readJson(photoRes);

  if (!photoData.ok) {
    throw new Error(photoData.description || "Telegram sendPhoto failed");
  }

  // 3. Send full text as separate message (IPv4)
  const textRes = await request(`${TELEGRAM_API}/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: caption,
      parse_mode: "HTML",
    }),
  });

  const textData = await readJson(textRes);

  if (!textData.ok) {
    throw new Error(textData.description || "Telegram sendMessage failed");
  }

  return { messageId: textData.result.message_id };
}

export async function testTelegramConnection(
  botToken: string,
  chatId: string
): Promise<{ botName: string; chatValid: boolean }> {
  // Verify bot token (IPv4)
  const botRes = await request(`${TELEGRAM_API}/bot${botToken}/getMe`, { method: "GET" });
  const botData = await readJson(botRes);

  if (!botData.ok) {
    throw new Error("Invalid bot token");
  }

  // Test sending a message (IPv4)
  const testRes = await request(`${TELEGRAM_API}/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: "✅ Bot connected successfully! You will receive generated social media posts here.",
    }),
  });

  const testData = await readJson(testRes);

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
