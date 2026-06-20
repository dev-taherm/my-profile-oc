import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/about", "/services", "/projects", "/blog", "/resume", "/contact"];

  const entries: MetadataRoute.Sitemap = [];

  for (const page of staticPages) {
    entries.push({
      url: `${BASE_URL}/en${page}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: page === "" ? 1 : 0.8,
      alternates: {
        languages: {
          en: `${BASE_URL}/en${page}`,
          ar: `${BASE_URL}/ar${page}`,
        },
      },
    });
  }

  return entries;
}
