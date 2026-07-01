export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n/get-dictionary";
import { prisma } from "@/lib/prisma";
import { type Locale } from "@/lib/constants";
import { getSiteProfile } from "@/lib/profile";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { ProjectDetail } from "@/components/projects/ProjectDetail";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  const profile = await getSiteProfile();
  const baseUrl = profile.url;

  const project = await prisma.project.findUnique({
    where: { slug },
    include: { translations: true },
  });

  if (!project) return {};

  const t = project.translations.find((tr) => tr.locale === locale) || project.translations[0];
  if (!t) return {};

  const url = `${baseUrl}/${locale}/projects/${slug}`;

  return {
    title: t.title,
    description: t.description?.substring(0, 160),
    alternates: {
      canonical: url,
      languages: {
        "en": `${baseUrl}/en/projects/${slug}`,
        "ar": `${baseUrl}/ar/projects/${slug}`,
        "x-default": `${baseUrl}/en/projects/${slug}`,
      },
    },
    openGraph: {
      title: t.title,
      description: t.description?.substring(0, 160),
      url,
      type: "website",
      images: [{ url: `${baseUrl}/api/og?title=${encodeURIComponent(t.title)}&subtitle=${encodeURIComponent(t.description?.substring(0, 100) || "")}&locale=${locale}`, width: 1200, height: 630, alt: t.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: t.title,
      description: t.description?.substring(0, 160),
      images: [`${baseUrl}/api/og?title=${encodeURIComponent(t.title)}&subtitle=${encodeURIComponent(t.description?.substring(0, 100) || "")}&locale=${locale}`],
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  const dict = await getDictionary(locale);
  const profile = await getSiteProfile();

  const project = await prisma.project.findUnique({
    where: { slug },
    include: {
      translations: true,
      categories: true,
      tags: true,
      projectImages: { orderBy: { order: "asc" as const } },
    },
  });

  if (!project) notFound();

  const translation = project.translations.find((t) => t.locale === locale)
    || project.translations.find((t) => t.locale === "en")
    || project.translations[0];

  if (!translation) notFound();

  const serializedProject = {
    ...project,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
    translation,
  };

  const baseUrl = profile.url;
  const projectSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: translation.title,
    description: translation.description?.substring(0, 300),
    url: `${baseUrl}/${locale}/projects/${slug}`,
    author: {
      "@type": "Person",
      name: profile.name,
      url: baseUrl,
    },
    dateModified: project.updatedAt.toISOString(),
    inLanguage: locale,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: locale === "ar" ? "الرئيسية" : "Home", item: `${baseUrl}/${locale}` },
      { "@type": "ListItem", position: 2, name: dict.projects.title, item: `${baseUrl}/${locale}/projects` },
      { "@type": "ListItem", position: 3, name: translation.title },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Header locale={locale} dict={dict} />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <Breadcrumb
            items={[
              { label: dict.breadcrumbs.home, href: `/${locale}` },
              { label: dict.projects.title, href: `/${locale}/projects` },
              { label: translation.title },
            ]}
            locale={locale}
          />
          <ProjectDetail project={serializedProject} locale={locale} dict={dict} />
        </div>
      </main>
      <Footer locale={locale} dict={dict} profile={profile} />
    </>
  );
}
