import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createHash } from "crypto";

function hashSession(ip: string | null, ua: string | null): string {
  const raw = `${ip || "unknown"}-${ua || "unknown"}`;
  return createHash("sha256").update(raw).digest("hex").slice(0, 16);
}

const IGNORED_PATHS = new Set([
  "/api",
  "/admin",
  "/_next",
  "/uploads",
  "/favicon",
  "/llms.txt",
  "/robots.txt",
  "/sitemap.xml",
]);

function shouldTrack(path: string): boolean {
  for (const ignored of IGNORED_PATHS) {
    if (path.startsWith(ignored)) return false;
  }
  if (path.includes(".")) return false;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path, referrer, userAgent, country } = body;

    if (!path || !shouldTrack(path)) {
      return NextResponse.json({ ok: true });
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const sessionId = hashSession(ip, userAgent || null);

    await prisma.pageView.create({
      data: {
        path,
        referrer: referrer || null,
        userAgent: userAgent || null,
        country: country || null,
        sessionId,
        ip,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
