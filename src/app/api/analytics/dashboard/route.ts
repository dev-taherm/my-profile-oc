import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function parseUA(ua: string | null): { browser: string; device: string } {
  if (!ua) return { browser: "Unknown", device: "Unknown" };

  let browser = "Other";
  if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Edg/")) browser = "Edge";
  else if (ua.includes("Chrome")) browser = "Chrome";
  else if (ua.includes("Safari")) browser = "Safari";

  let device = "Desktop";
  if (ua.includes("Mobile") || ua.includes("Android")) device = "Mobile";
  else if (ua.includes("iPad") || ua.includes("Tablet")) device = "Tablet";

  return { browser, device };
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "30d";

    const days = period === "7d" ? 7 : period === "90d" ? 90 : 30;
    const since = new Date();
    since.setDate(since.getDate() - days);

    const views = await prisma.pageView.findMany({
      where: { createdAt: { gte: since } },
      orderBy: { createdAt: "asc" },
    });

    const totalViews = views.length;
    const uniqueVisitors = new Set(views.map((v) => v.sessionId)).size;

    const dailyMap = new Map<string, { views: number; unique: Set<string> }>();
    const pageMap = new Map<string, { views: number; unique: Set<string> }>();
    const referrerMap = new Map<string, number>();
    const browserMap = new Map<string, number>();
    const deviceMap = new Map<string, number>();
    const countryMap = new Map<string, number>();

    for (const v of views) {
      const date = v.createdAt.toISOString().slice(0, 10);
      const day = dailyMap.get(date) || { views: 0, unique: new Set() };
      day.views++;
      if (v.sessionId) day.unique.add(v.sessionId);
      dailyMap.set(date, day);

      const page = pageMap.get(v.path) || { views: 0, unique: new Set() };
      page.views++;
      if (v.sessionId) page.unique.add(v.sessionId);
      pageMap.set(v.path, page);

      if (v.referrer && !v.referrer.includes("taher.pixovagency.com")) {
        referrerMap.set(v.referrer, (referrerMap.get(v.referrer) || 0) + 1);
      }

      const { browser, device } = parseUA(v.userAgent);
      browserMap.set(browser, (browserMap.get(browser) || 0) + 1);
      deviceMap.set(device, (deviceMap.get(device) || 0) + 1);

      if (v.country) {
        countryMap.set(v.country, (countryMap.get(v.country) || 0) + 1);
      }
    }

    const daily = Array.from(dailyMap.entries()).map(([date, d]) => ({
      date,
      views: d.views,
      unique: d.unique.size,
    }));

    const topPages = Array.from(pageMap.entries())
      .map(([path, p]) => ({ path, views: p.views, unique: p.unique.size }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    const topReferrers = Array.from(referrerMap.entries())
      .map(([source, views]) => ({ source, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    const browsers = Array.from(browserMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    const devices = Array.from(deviceMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    const countries = Array.from(countryMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const mostPopularPage = topPages[0]?.path || "-";

    return NextResponse.json({
      totalViews,
      uniqueVisitors,
      mostPopularPage,
      daily,
      topPages,
      topReferrers,
      browsers,
      devices,
      countries,
    });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
