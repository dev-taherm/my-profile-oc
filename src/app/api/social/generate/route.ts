import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { buildAiRequest } from "@/lib/ai-providers";
import { prisma } from "@/lib/prisma";

function buildSystemPrompt(platform: string, locale: string, tone: string): string {
  const lang = locale === "ar" ? "Arabic" : "English";

  const platformRules =
    platform === "linkedin"
      ? `## Platform: LinkedIn
- Max length: ~1300 characters (posts get truncated in feed beyond this)
- Use line breaks for scannability
- Include 3-5 relevant hashtags at the end
- Emojis: minimal, none in the first line`
      : `## Platform: Facebook
- Use short paragraphs (1-2 lines)
- Emojis: natural use, 3-5 max
- Include a clear call-to-action
- 1-2 hashtags at most (or none)
- End with a question to drive comments`;

  const toneRules =
    tone === "professional"
      ? `## Tone: Professional
- Thought leadership, data-driven
- Formal but approachable, no hype
- Use specific metrics and evidence ("reduced load time by 40%", not "made it faster")
- Structure: Bold Hook → Key Insight → Evidence → Takeaway
- End with a thought-provoking question or call-to-action
- Write from first-person perspective (Taher's voice)`

      : tone === "viral"
      ? `## Tone: Viral
- Open with a pattern interrupt (something unexpected or counterintuitive)
- Use emotional triggers: curiosity, surprise, FOMO, debate
- Specific numbers over vague claims ("3 years" not "many years")
- Bold or slightly controversial angle — make people want to respond
- Use "you" language directly addressing the reader
- Create tension or story arc
- End with a polarizing question that triggers comments/debate
- Structure: Shocking Hook → Story/Tension → Resolution → Debate Question`

      : `## Tone: Mix (Professional + Viral)
- Professional credibility with viral hooks
- Data-driven BUT presented as storytelling
- Bold claims backed by evidence
- Pattern interrupt opening + professional body
- Use specific metrics AND emotional triggers
- Structure: Bold Hook → Evidence → Insight → Provocative Question`;

  return `You are an expert social media content strategist for Taher Mahram, a software engineer specializing in backend systems, AI/LLM integration, and full-stack web development based in Sana'a, Yemen.

## Your Task
Generate a social media post. The post will be sent to the user via Telegram for review before manually posting to their social media accounts.

${platformRules}

${toneRules}

## General Rules
- No generic filler — every sentence must add value
- Use emojis for emphasis where natural (💪, 🔥, etc.) — no HTML tags or markdown formatting
- Make the first line irresistible — it determines if anyone reads the rest

## CRITICAL: Language
You MUST write the ENTIRE post in ${lang}. Do NOT use any other language.
If ${lang} is Arabic, write fluent, natural Arabic — not machine translation.
If ${lang} is English, write natural, conversational English.

## Response Format
Return ONLY the post content, nothing else. No labels, no explanations, no quotes around the post.`;
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { content, sourceType, sourceId, platform, locale, tone } = await request.json();

    const resolvedPlatform = platform === "facebook" ? "facebook" : "linkedin";
    const resolvedLocale = locale === "ar" ? "ar" : "en";
    const resolvedTone = ["professional", "viral", "mix"].includes(tone) ? tone : "professional";

    let prompt: string;

    if (sourceType && sourceId) {
      let entity: {
        id: string;
        translations: Record<string, unknown>[];
      } | null = null;

      if (sourceType === "project") {
        entity = await prisma.project.findUnique({
          where: { id: sourceId },
          include: { translations: true },
        });
      } else if (sourceType === "blog") {
        entity = await prisma.blogPost.findUnique({
          where: { id: sourceId },
          include: { translations: true },
        });
      }

      if (!entity) {
        return new Response(
          JSON.stringify({ error: `${sourceType} not found` }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }

      const translation =
        entity.translations.find((t) => t.locale === resolvedLocale) ||
        entity.translations[0];

      if (!translation) {
        return new Response(
          JSON.stringify({ error: "No translations found for this content" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      const entityType = sourceType === "project" ? "Project" : "Blog Post";
      const description = (translation.description || translation.excerpt || "") as string;
      const bodyContent = (translation.content || "") as string;

      prompt = `Create a ${resolvedPlatform} post about this ${entityType}:

Title: "${translation.title}"
Description: ${description || "(none)"}
${bodyContent ? `Full content:\n${bodyContent.substring(0, 2000)}` : ""}`;
    } else if (content) {
      prompt = `Create a ${resolvedPlatform} post based on the following content:\n\n${content}`;
    } else {
      return new Response(
        JSON.stringify({ error: "content or sourceType+sourceId is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = buildSystemPrompt(resolvedPlatform, resolvedLocale, resolvedTone);
    const { url, headers, body } = await buildAiRequest({
      prompt,
      systemPrompt,
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
