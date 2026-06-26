import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { query, maxResults = 5, searchDepth = "basic" } = body;

  if (!query) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  const settings = await prisma.aiSettings.findUnique({ where: { id: "default" } });
  const tavilyKey = settings?.tavilyApiKey;

  if (!tavilyKey) {
    return NextResponse.json(
      { error: "Tavily API key not configured. Go to AI Settings to add it." },
      { status: 400 }
    );
  }

  try {
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tavilyKey}`,
      },
      body: JSON.stringify({
        query,
        search_depth: searchDepth,
        max_results: maxResults,
        include_answer: true,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: `Tavily API error (${response.status}): ${JSON.stringify(error).slice(0, 200)}` },
        { status: 502 }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      query: data.query,
      answer: data.answer,
      results: data.results?.map((r: { title: string; url: string; content: string; score: number }) => ({
        title: r.title,
        url: r.url,
        content: r.content,
        score: r.score,
      })) || [],
      responseTime: data.response_time,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Search failed: ${message}` }, { status: 500 });
  }
}
