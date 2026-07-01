import { MetadataRoute } from "next";
import { getSiteProfile } from "@/lib/profile";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const profile = await getSiteProfile();
  const baseUrl = profile.url;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
