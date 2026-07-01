import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { buildAiRequest, buildSystemPrompt, parseProviderChunk, getAiSettings, type AiSettingsData } from "@/lib/ai-providers";
import { requestStream } from "@/lib/ipv4-fetch";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { prompt, entityType, locale, providerConfig, chatHistory } = body;

  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  let settings: AiSettingsData;

  if (providerConfig && providerConfig.provider) {
    settings = {
      provider: providerConfig.provider,
      apiKey: providerConfig.apiKey || null,
      baseUrl: providerConfig.baseUrl || null,
      model: providerConfig.model || "",
      tavilyApiKey: null,
    };
  } else {
    settings = await getAiSettings();
  }

  if (!settings.apiKey && settings.provider !== "ollama") {
    return NextResponse.json(
      { error: "AI API key not configured. Go to AI Settings to configure." },
      { status: 400 }
    );
  }

  // Fetch existing articles for topic clustering
  let existingArticles = "";
  try {
    const posts = await prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      include: { translations: { where: { locale: "en" }, select: { title: true } } },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    const titles = posts
      .map((p) => p.translations[0]?.title)
      .filter(Boolean);
    if (titles.length > 0) {
      existingArticles = titles.map((t, i) => `${i + 1}. ${t}`).join("\n");
    }
  } catch {
    // ignore — proceed without existing articles
  }

  // Always build system prompt server-side for security
  const finalSystemPrompt = buildSystemPrompt(
    entityType || "blog",
    locale || "en",
    body.title || "",
    body.excerpt || "",
    body.currentContent || "",
    body.availableTags || "",
    body.availableCategories || "",
    existingArticles
  );

  try {
    const req = await buildAiRequest(
      {
        prompt,
        systemPrompt: finalSystemPrompt,
        chatHistory: chatHistory || [],
      },
      settings
    );

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 90000);

    let res;
    try {
      res = await requestStream(req.url, {
        method: "POST",
        headers: req.headers,
        body: JSON.stringify(req.body),
        signal: controller.signal,
        timeout: 90000,
      });
    } catch (fetchErr) {
      clearTimeout(timeout);
      const msg = fetchErr instanceof Error ? fetchErr.message : "Unknown error";
      if (msg.includes("ETIMEDOUT") || msg.includes("timeout") || msg.includes("abort")) {
        return NextResponse.json(
          { error: "Network timeout connecting to AI provider. Check your internet connection and try again." },
          { status: 504 }
        );
      }
      return NextResponse.json(
        { error: `Failed to connect to AI provider: ${msg}` },
        { status: 502 }
      );
    }

    clearTimeout(timeout);

    if (!res.ok) {
      const chunks: Buffer[] = [];
      for await (const chunk of res.stream) chunks.push(chunk);
      const errorText = Buffer.concat(chunks).toString("utf-8").slice(0, 500);
      return NextResponse.json(
        { error: `AI provider error (${res.status}): ${errorText}` },
        { status: 502 }
      );
    }

    const provider = settings.provider;
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        let buffer = "";
        try {
          for await (const chunk of res.stream) {
            buffer += decoder.decode(chunk, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              const text = parseProviderChunk(provider, line);
              if (text) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
              }
            }
          }

          if (buffer) {
            const text = parseProviderChunk(provider, buffer);
            if (text) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
            }
          }

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `AI request failed: ${message}` }, { status: 500 });
  }
}
