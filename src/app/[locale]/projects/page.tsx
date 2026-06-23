export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { getDictionary } from "@/i18n/get-dictionary";
import { prisma } from "@/lib/prisma";
import { type Locale, siteConfig } from "@/lib/constants";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/shared/PageHeader";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { ProjectsList } from "@/components/projects/ProjectsList";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const baseUrl = siteConfig.url;

  const titles: Record<Locale, string> = {
    en: "Projects — Software Engineering Portfolio by Taher Mahram",
    ar: "المشاريع — معرض مهندس البرمجيات طاهر محرم",
  };

  const descriptions: Record<Locale, string> = {
    en: "Explore software engineering projects by Taher Mahram — Django backends, AI integrations, automation systems, and scalable web applications.",
    ar: "استكشف مشاريع هندسة البرمجيات بواسطة طاهر محرم — أنظمة Django الخلفية ودمج الذكاء الاصطناعي وأنظمة الأتمتة وتطبيقات الويب القابلة للتوسع.",
  };

  return {
    title: titles[locale],
    description: descriptions[locale],
    alternates: {
      canonical: `${baseUrl}/${locale}/projects`,
      languages: {
        "en": `${baseUrl}/en/projects`,
        "ar": `${baseUrl}/ar/projects`,
        "x-default": `${baseUrl}/en/projects`,
      },
    },
    openGraph: {
      title: titles[locale],
      description: descriptions[locale],
      url: `${baseUrl}/${locale}/projects`,
      type: "website",
      images: [{ url: `${baseUrl}/api/og?title=${encodeURIComponent(titles[locale])}&subtitle=${encodeURIComponent(descriptions[locale])}&locale=${locale}`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: titles[locale],
      description: descriptions[locale],
      images: [`${baseUrl}/api/og?title=${encodeURIComponent(titles[locale])}&subtitle=${encodeURIComponent(descriptions[locale])}&locale=${locale}`],
    },
  };
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const dict = await getDictionary(locale);

  let serializedProjects: React.ComponentProps<typeof ProjectsList>["projects"] = [];
  try {
    const projects = await prisma.project.findMany({
      where: { status: "PUBLISHED" },
      include: {
        translations: true,
        categories: true,
        tags: true,
        projectImages: { orderBy: { order: "asc" as const } },
      },
      orderBy: { order: "asc" },
    });

    serializedProjects = projects.map((p) => ({
      ...p,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
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
          { "@type": "ListItem", position: 2, name: dict.projects.title },
        ],
      }) }} />
      <Header locale={locale} dict={dict} />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <PageHeader title={dict.projects.title} subtitle={dict.projects.subtitle} />
          <Breadcrumb
            items={[
              { label: dict.breadcrumbs.home, href: `/${locale}` },
              { label: dict.projects.title },
            ]}
            locale={locale}
          />
          <ProjectsList projects={serializedProjects} locale={locale} dict={dict} />
        </div>
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  );
}
