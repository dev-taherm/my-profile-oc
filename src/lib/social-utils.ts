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
