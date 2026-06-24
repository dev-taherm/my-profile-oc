import { prisma } from "@/lib/prisma";
import { siteConfig, locales } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET() {
  const baseUrl = siteConfig.url;

  const [publishedPosts, publishedProjects, publishedServices] = await Promise.all([
    prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      select: {
        slug: true,
        updatedAt: true,
        translations: { select: { title: true, excerpt: true, locale: true } },
      },
      orderBy: { publishedAt: "desc" },
    }),
    prisma.project.findMany({
      where: { status: "PUBLISHED" },
      select: {
        slug: true,
        updatedAt: true,
        translations: { select: { title: true, description: true, locale: true } },
      },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.service.findMany({
      where: { status: "PUBLISHED" },
      select: {
        slug: true,
        updatedAt: true,
        translations: { select: { title: true, shortDesc: true, locale: true } },
      },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  const items: string[] = [];

  for (const post of publishedPosts) {
    const t = post.translations.find((tr) => tr.locale === "en") || post.translations[0];
    if (!t) continue;
    items.push(`    <item>
      <title>${escapeXml(t.title)}</title>
      <link>${baseUrl}/en/blog/${post.slug}</link>
      <guid>${baseUrl}/en/blog/${post.slug}</guid>
      <description>${escapeXml(t.excerpt || "")}</description>
      <pubDate>${post.updatedAt.toUTCString()}</pubDate>
      <category>Blog</category>
    </item>`);
  }

  for (const project of publishedProjects) {
    const t = project.translations.find((tr) => tr.locale === "en") || project.translations[0];
    if (!t) continue;
    items.push(`    <item>
      <title>${escapeXml(t.title)}</title>
      <link>${baseUrl}/en/projects/${project.slug}</link>
      <guid>${baseUrl}/en/projects/${project.slug}</guid>
      <description>${escapeXml(t.description?.substring(0, 200) || "")}</description>
      <pubDate>${project.updatedAt.toUTCString()}</pubDate>
      <category>Project</category>
    </item>`);
  }

  for (const service of publishedServices) {
    const t = service.translations.find((tr) => tr.locale === "en") || service.translations[0];
    if (!t) continue;
    items.push(`    <item>
      <title>${escapeXml(t.title)}</title>
      <link>${baseUrl}/en/services/${service.slug}</link>
      <guid>${baseUrl}/en/services/${service.slug}</guid>
      <description>${escapeXml(t.shortDesc || "")}</description>
      <pubDate>${service.updatedAt.toUTCString()}</pubDate>
      <category>Service</category>
    </item>`);
  }

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteConfig.name} — Software Engineer</title>
    <link>${baseUrl}</link>
    <description>${siteConfig.description}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
${items.join("\n")}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
