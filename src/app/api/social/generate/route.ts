import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { buildAiRequest } from "@/lib/ai-providers";
import { prisma } from "@/lib/prisma";
import { searchTrends } from "@/lib/social-trends";

function buildSystemPrompt(
  platform: string,
  locale: string,
  tone: string,
  trendContext: string,
  audienceHint: string
): string {
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
      ? `## Tone: Professional (but human)
- Like a respected community member sharing hard-won lessons
- Data + story, not data alone
- "Here's what I learned building this" not "Here's a thought leadership piece"
- Use specific metrics and evidence ("reduced load time by 40%", not "made it faster")
- Structure: Hook → Story/Experience → Evidence → Takeaway
- End with a genuine question you actually want answered`
      : tone === "viral"
      ? `## Tone: Viral (tech influencer style)
- Open with a pattern interrupt — something unexpected or counterintuitive
- "Unpopular opinion:" or "Nobody talks about this but..." or "I was wrong about..."
- Use emotional triggers: curiosity, surprise, FOMO, debate
- Specific numbers over vague claims ("3 years" not "many years")
- Bold or slightly controversial angle — make people want to respond
- Use "you" language directly addressing the reader
- Create tension or story arc
- End with a polarizing question that triggers comments/debate
- Structure: Shocking Hook → Story/Tension → Resolution → Debate Question`
      : `## Tone: Mix (Professional + Viral)
- Bold hook + professional body
- Credibility + shareability
- Data-driven BUT presented as storytelling
- Bold claims backed by evidence
- Pattern interrupt opening + professional body
- Use specific metrics AND emotional triggers
- Structure: Bold Hook → Evidence → Insight → Provocative Question`;

  const trendSection = trendContext
    ? `## Current Trends (use these naturally, don't force them)
${trendContext}`
    : "";

  const audienceSection = audienceHint
    ? `## Target Audience
${audienceHint}`
    : "";

  const menaSection =
    locale === "ar"
      ? `## MENA-Specific (Arabic posts ONLY)
- Reference the Yemen/Saudi/Gulf tech ecosystem specifically
- Mention local challenges: infrastructure, remote work, internet stability, Arabic dev community growth
- Use Arabic tech community language and slang — not MSA textbook Arabic
- Reference local context: Sana'a, Riyadh, Dubai tech scenes, MENA startups
- Speak to Arabic-speaking developers as peers, not an audience`
      : "";

  return `You are Taher — a real software engineer sharing what you actually built. You're not a marketer. You're not writing a press release. You're telling a friend about something cool you made.

Write like a real human, not a chatbot. Use contractions. Start sentences with "And" or "But" or "So". Share specific moments. Be casual, confident, and authentic.

${platformRules}

${toneRules}

${trendSection}

${audienceSection}

${menaSection}

## Writing Style Rules (CRITICAL — follow these exactly)
- Use contractions: don't, it's, I've, can't, won't, isn't
- Start sentences with And, But, So — humans do this constantly
- Share specific moments: "I was debugging at 2am when..." or "After 3 weeks of trying..."
- Use numbers, not vague claims: "37% faster" not "significantly faster"
- Break grammar rules intentionally for emphasis
- Banned words — NEVER use these: leverage, synergy, streamline, utilize, facilitate, empower, unlock, revolutionize, cutting-edge, seamless, holistic, robust, scalable, innovative
- No corporate buzzwords — say what you actually mean
- Write like you're texting a friend who works in tech
- Use emojis for emphasis where natural (💪, 🔥, etc.) — no HTML tags or markdown formatting
- Make the first line irresistible — it determines if anyone reads the rest
- No generic filler — every sentence must add value

## CRITICAL: Language
You MUST write the ENTIRE post in ${lang}. Do NOT use any other language.
If ${lang} is Arabic, write fluent, natural Arabic — not machine translation. Use colloquial Arabic that real people speak, not formal MSA.
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
    const { content, sourceType, sourceId, platform, locale, tone, searchTopic } =
      await request.json();

    const resolvedPlatform = platform === "facebook" ? "facebook" : "linkedin";
    const resolvedLocale = locale === "ar" ? "ar" : "en";
    const resolvedTone = ["professional", "viral", "mix"].includes(tone) ? tone : "professional";

    let prompt: string;
    let trendQuery: string;
    let audienceHint: string;

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

      trendQuery = `${translation.title} ${resolvedPlatform} trends ${new Date().getFullYear()}`;
      audienceHint = `This is a ${entityType.toLowerCase()} post. The audience is people interested in: ${translation.title}. Tailor the language and references to match this topic's community.`;
    } else if (content) {
      if (!searchTopic) {
        return new Response(
          JSON.stringify({ error: "searchTopic is required when using custom content" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      prompt = `Create a ${resolvedPlatform} post based on the following content:\n\n${content}`;
      trendQuery = `${searchTopic} ${resolvedPlatform} trends ${new Date().getFullYear()}`;
      audienceHint = `The topic is: ${searchTopic}. Tailor the language and references to match this topic's community.`;
    } else {
      return new Response(
        JSON.stringify({ error: "content or sourceType+sourceId is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const trendContext = await searchTrends(trendQuery);

    const systemPrompt = buildSystemPrompt(
      resolvedPlatform,
      resolvedLocale,
      resolvedTone,
      trendContext,
      audienceHint
    );

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
