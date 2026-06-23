import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { siteConfig, locales, localeConfig } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;
  const staticPages = ["", "/about", "/services", "/projects", "/blog", "/resume", "/contact", "/privacy", "/terms"];
  const staticDates: Record<string, string> = {
    "": "2025-06-23",
    "/about": "2025-06-23",
    "/services": "2025-06-23",
    "/projects": "2025-06-23",
    "/blog": "2025-06-23",
    "/resume": "2025-06-23",
    "/contact": "2025-06-23",
    "/privacy": "2025-06-23",
    "/terms": "2025-06-23",
  };

  const entries: MetadataRoute.Sitemap = [];

  for (const page of staticPages) {
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(staticDates[page]),
        changeFrequency: page === "" ? "daily" : "weekly",
        priority: page === "" ? 1 : 0.8,
        alternates: {
          languages: {
            ...Object.fromEntries(
              locales.map((l) => [localeConfig[l].hreflang, `${baseUrl}/${l}${page}`])
            ),
            "x-default": `${baseUrl}/en${page}`,
          },
        },
      });
    }
  }

  try {
    const [publishedPosts, publishedProjects, publishedServices] = await Promise.all([
      prisma.blogPost.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true, coverImage: true, translations: { select: { title: true, locale: true } } },
      }),
      prisma.project.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true, projectImages: { select: { url: true }, take: 1, orderBy: { order: "asc" } }, translations: { select: { title: true, locale: true } } },
      }),
      prisma.service.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true, translations: { select: { title: true, locale: true } } },
      }),
    ]);

    for (const post of publishedPosts) {
      for (const locale of locales) {
        const postUrl = `${baseUrl}/${locale}/blog/${post.slug}`;
        const imageUrls: string[] = [];
        if (post.coverImage) {
          imageUrls.push(post.coverImage);
        }
        entries.push({
          url: postUrl,
          lastModified: post.updatedAt,
          changeFrequency: "monthly",
          priority: 0.6,
          images: imageUrls.length > 0 ? imageUrls : undefined,
          alternates: {
            languages: {
              ...Object.fromEntries(
                locales.map((l) => [localeConfig[l].hreflang, `${baseUrl}/${l}/blog/${post.slug}`])
              ),
              "x-default": `${baseUrl}/en/blog/${post.slug}`,
            },
          },
        });
      }
    }

    for (const project of publishedProjects) {
      for (const locale of locales) {
        const projectUrl = `${baseUrl}/${locale}/projects/${project.slug}`;
        const imageUrls: string[] = project.projectImages.map((img) => img.url);
        entries.push({
          url: projectUrl,
          lastModified: project.updatedAt,
          changeFrequency: "monthly",
          priority: 0.6,
          images: imageUrls.length > 0 ? imageUrls : undefined,
          alternates: {
            languages: {
              ...Object.fromEntries(
                locales.map((l) => [localeConfig[l].hreflang, `${baseUrl}/${l}/projects/${project.slug}`])
              ),
              "x-default": `${baseUrl}/en/projects/${project.slug}`,
            },
          },
        });
      }
    }

    for (const service of publishedServices) {
      for (const locale of locales) {
        entries.push({
          url: `${baseUrl}/${locale}/services/${service.slug}`,
          lastModified: service.updatedAt,
          changeFrequency: "monthly",
          priority: 0.6,
          alternates: {
            languages: {
              ...Object.fromEntries(
                locales.map((l) => [localeConfig[l].hreflang, `${baseUrl}/${l}/services/${service.slug}`])
              ),
              "x-default": `${baseUrl}/en/services/${service.slug}`,
            },
          },
        });
      }
    }
  } catch {
    // DB may not be available at build time
  }

  return entries;
}
