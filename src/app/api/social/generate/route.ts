import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { buildAiRequest } from "@/lib/ai-providers";

const TELEGRAM_SYSTEM_PROMPT = `You are an expert social media content strategist for Taher Mahram, a software engineer specializing in backend systems, AI/LLM integration, and full-stack web development based in Sana'a, Yemen.

## Your Task
Generate a social media post based on the user's input. The post will be sent to the user via Telegram for review before manually posting to their social media accounts.

## Rules
- Write engaging, professional content
- Start with a hook (question, bold statement, or insight)
- Use short paragraphs (1-2 lines) for readability
- Include relevant hashtags (3-5)
- End with a call-to-action or question to drive engagement
- No strict character limit, but keep it concise (aim for 200-500 words)
- Support both LinkedIn and Facebook style (default to professional tone)
- Use HTML formatting: <b>bold</b>, <i>italic</i>, <code>code</code>

## Response Format
Return ONLY the post content, nothing else. No labels, no explanations, no quotes around the post.`;

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { content } = await request.json();

    if (!content) {
      return new Response(
        JSON.stringify({ error: "content is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const prompt = `Create a social media post based on the following content:\n\n${content}`;
    const { url, headers, body } = await buildAiRequest({
      prompt,
      systemPrompt: TELEGRAM_SYSTEM_PROMPT,
    });

    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      return new Response(
        JSON.stringify({ error: `AI provider error: ${err}` }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    // Stream the response
    const reader = res.body?.getReader();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        if (!reader) {
          controller.close();
          return;
        }

        let buffer = "";
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6).trim();
                if (data === "[DONE]") continue;

                try {
                  const parsed = JSON.parse(data);
                  let chunk = "";

                  // Handle different provider formats
                  if (parsed.choices?.[0]?.delta?.content) {
                    chunk = parsed.choices[0].delta.content;
                  } else if (parsed.message?.content) {
                    chunk = parsed.message.content;
                  } else if (parsed.type === "content_block_delta") {
                    chunk = parsed.delta?.text || "";
                  } else if (parsed.candidates?.[0]?.content?.parts?.[0]?.text) {
                    chunk = parsed.candidates[0].content.parts[0].text;
                  }

                  if (chunk) {
                    controller.enqueue(
                      new TextEncoder().encode(`data: ${JSON.stringify({ content: chunk })}\n\n`)
                    );
                  }
                } catch {
                  // Skip malformed JSON
                }
              }
            }
          }
        } finally {
          controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"));
          controller.close();
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
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
