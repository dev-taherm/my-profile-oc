import { prisma } from "@/lib/prisma";

export async function searchTrends(query: string): Promise<string> {
  const settings = await prisma.aiSettings.findUnique({ where: { id: "default" } });
  const tavilyKey = settings?.tavilyApiKey;

  if (!tavilyKey) {
    return "";
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
        search_depth: "basic",
        max_results: 5,
        include_answer: true,
      }),
    });

    if (!response.ok) return "";

    const data = await response.json();

    const parts: string[] = [];

    if (data.answer) {
      parts.push(`Summary: ${data.answer}`);
    }

    if (data.results?.length) {
      for (const r of data.results.slice(0, 5)) {
        parts.push(`- ${r.title}: ${r.content?.substring(0, 200) || ""}`);
      }
    }

    return parts.join("\n");
  } catch {
    return "";
  }
}
