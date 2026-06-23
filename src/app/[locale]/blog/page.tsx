export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { getDictionary } from "@/i18n/get-dictionary";
import { prisma } from "@/lib/prisma";
import { type Locale, siteConfig } from "@/lib/constants";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/shared/PageHeader";
import { BlogList } from "@/components/blog/BlogList";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const baseUrl = siteConfig.url;

  const titles: Record<Locale, string> = {
    en: "Blog — Software Engineering Articles by Taher Mahram",
    ar: "المدونة — مقالات هندسة البرمجيات بواسطة طاهر محرم",
  };

  const descriptions: Record<Locale, string> = {
    en: "Technical articles and insights on software engineering, backend development, AI systems, and scalable architectures by Taher Mahram.",
    ar: "مقالات ورؤى تقنية في هندسة البرمجيات وتطوير الأنظمة الخلفية والذكاء الاصطناعي والهندسة المعمارية القابلة للتوسع بواسطة طاهر محرم.",
  };

  return {
    title: titles[locale],
    description: descriptions[locale],
    alternates: {
      canonical: `${baseUrl}/${locale}/blog`,
      languages: {
        "en": `${baseUrl}/en/blog`,
        "ar": `${baseUrl}/ar/blog`,
        "x-default": `${baseUrl}/en/blog`,
      },
    },
    openGraph: {
      title: titles[locale],
      description: descriptions[locale],
      url: `${baseUrl}/${locale}/blog`,
      type: "website",
      images: [{ url: `${baseUrl}/images/profile.jpg`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: titles[locale],
      description: descriptions[locale],
      images: [`${baseUrl}/images/profile.jpg`],
    },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const dict = await getDictionary(locale);

  let serializedPosts: React.ComponentProps<typeof BlogList>["posts"] = [];
  try {
    const posts = await prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      include: {
        translations: true,
        categories: true,
        tags: true,
        author: { select: { name: true } },
      },
      orderBy: { publishedAt: "desc" },
    });

    serializedPosts = posts.map((p) => ({
      ...p,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
      publishedAt: p.publishedAt?.toISOString() ?? null,
    }));
  } catch {
    // Database not available
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: locale === "ar" ? "الرئيسية" : "Home", item: `${siteConfig.url}/${locale}` },
          { "@type": "ListItem", position: 2, name: dict.blog.title },
        ],
      }) }} />
      <Header locale={locale} dict={dict} />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <PageHeader title={dict.blog.title} subtitle={dict.blog.subtitle} />
          <BlogList posts={serializedPosts} locale={locale} dict={dict} />
        </div>
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  );
}
