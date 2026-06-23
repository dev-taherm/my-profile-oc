export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { getDictionary } from "@/i18n/get-dictionary";
import { type Locale, siteConfig } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { FeaturedTech } from "@/components/sections/FeaturedTech";
import { FeaturedServices } from "@/components/sections/FeaturedServices";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { LatestBlog } from "@/components/sections/LatestBlog";
import { CTA } from "@/components/sections/CTA";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const dict = await getDictionary(locale);
  const baseUrl = siteConfig.url;

  const titles: Record<Locale, string> = {
    en: `${dict.hero.name} — Software Engineer | Backend & AI Systems`,
    ar: `${dict.hero.name} — مهندس برمجيات | الأنظمة الخلفية والذكاء الاصطناعي`,
  };

  const descriptions: Record<Locale, string> = {
    en: `${dict.hero.name} is a software engineer specializing in backend development, AI systems, and scalable architectures. View projects, services, and get in touch.`,
    ar: `${dict.hero.name} مهندس برمجيات متخصص في تطوير الأنظمة الخلفية والذكاء الاصطناعي والهندسة المعمارية القابلة للتوسع. عرض المشاريع والخدمات والتواصل.`,
  };

  return {
    title: titles[locale],
    description: descriptions[locale],
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        "en": `${baseUrl}/en`,
        "ar": `${baseUrl}/ar`,
        "x-default": `${baseUrl}/en`,
      },
    },
    openGraph: {
      title: titles[locale],
      description: descriptions[locale],
      url: `${baseUrl}/${locale}`,
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

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const dict = await getDictionary(locale);

  let services: React.ComponentProps<typeof FeaturedServices>["services"] = [];
  let projects: React.ComponentProps<typeof FeaturedProjects>["projects"] = [];
  let blogPosts: React.ComponentProps<typeof LatestBlog>["posts"] = [];

  try {
    const [dbServices, dbProjects, dbPosts] = await Promise.all([
      prisma.service.findMany({
        where: { status: "PUBLISHED" },
        include: { translations: true },
        orderBy: { order: "asc" },
        take: 3,
      }),
      prisma.project.findMany({
        where: { status: "PUBLISHED", featured: true },
        include: {
          translations: true,
          categories: true,
          tags: true,
          projectImages: { orderBy: { order: "asc" as const } },
        },
        orderBy: { order: "asc" },
        take: 3,
      }),
      prisma.blogPost.findMany({
        where: { status: "PUBLISHED" },
        include: { translations: true },
        orderBy: { publishedAt: "desc" },
        take: 2,
      }),
    ]);

    services = dbServices.map((s) => ({
      id: s.id,
      slug: s.slug,
      icon: s.icon,
      translation: s.translations.find((t) => t.locale === locale) || s.translations[0],
    }));

    projects = dbProjects.map((p) => ({
      id: p.id,
      slug: p.slug,
      projectImages: p.projectImages.map((img) => ({ url: img.url, order: img.order })),
      featured: p.featured,
      categories: p.categories.map((c) => ({ slug: c.slug, name: c.name })),
      tags: p.tags.map((t) => ({ slug: t.slug, name: t.name })),
      translations: p.translations.map((t) => ({
        locale: t.locale,
        title: t.title,
        description: t.description,
      })),
    }));

    blogPosts = dbPosts.map((p) => ({
      id: p.id,
      slug: p.slug,
      coverImage: p.coverImage,
      readingTime: p.readingTime,
      publishedAt: p.publishedAt?.toISOString() ?? null,
      translations: p.translations.map((t) => ({
        locale: t.locale,
        title: t.title,
        excerpt: t.excerpt,
      })),
    }));
  } catch {
    // Database not available
  }

  return (
    <>
      <Header locale={locale} dict={dict} />
      <main className="flex-1">
        <Hero locale={locale} dict={dict} />
        <Stats dict={dict} />
        <FeaturedTech dict={dict} />
        <FeaturedServices services={services} locale={locale} dict={dict} />
        <FeaturedProjects projects={projects} locale={locale} dict={dict} />
        <LatestBlog posts={blogPosts} locale={locale} dict={dict} />
        <CTA locale={locale} dict={dict} />
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  );
}
