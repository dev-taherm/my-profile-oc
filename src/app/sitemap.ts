import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { siteConfig, locales, localeConfig } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;
  const staticPages = ["", "/about", "/services", "/projects", "/blog", "/resume", "/contact"];

  const entries: MetadataRoute.Sitemap = [];

  for (const page of staticPages) {
    for (const locale of locales) {
      const geo = localeConfig[locale];
      entries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
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
        select: { slug: true, updatedAt: true },
      }),
      prisma.project.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true },
      }),
      prisma.service.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    for (const post of publishedPosts) {
      for (const locale of locales) {
        entries.push({
          url: `${baseUrl}/${locale}/blog/${post.slug}`,
          lastModified: post.updatedAt,
          changeFrequency: "monthly",
          priority: 0.6,
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
        entries.push({
          url: `${baseUrl}/${locale}/projects/${project.slug}`,
          lastModified: project.updatedAt,
          changeFrequency: "monthly",
          priority: 0.6,
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
