export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { getDictionary } from "@/i18n/get-dictionary";
import { prisma } from "@/lib/prisma";
import { type Locale, siteConfig } from "@/lib/constants";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/shared/PageHeader";
import { ServicesList } from "@/components/services/ServicesList";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const baseUrl = siteConfig.url;

  const titles: Record<Locale, string> = {
    en: "Services — Software Engineering by Taher Mahram",
    ar: "الخدمات — هندسة البرمجيات بواسطة طاهر محرم",
  };

  const descriptions: Record<Locale, string> = {
    en: "Software engineering services by Taher Mahram — backend development, AI integration, API design, database architecture, and system automation.",
    ar: "خدمات هندسة البرمجيات بواسطة طاهر محرم — تطوير الأنظمة الخلفية ودمج الذكاء الاصطناعي وتصميم واجهات البرمجة وهندسة قواعد البيانات وأتمتة الأنظمة.",
  };

  return {
    title: titles[locale],
    description: descriptions[locale],
    alternates: {
      canonical: `${baseUrl}/${locale}/services`,
      languages: {
        "en": `${baseUrl}/en/services`,
        "ar": `${baseUrl}/ar/services`,
        "x-default": `${baseUrl}/en/services`,
      },
    },
    openGraph: {
      title: titles[locale],
      description: descriptions[locale],
      url: `${baseUrl}/${locale}/services`,
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

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const dict = await getDictionary(locale);

  let services: React.ComponentProps<typeof ServicesList>["services"] = [];
  try {
    const dbServices = await prisma.service.findMany({
      where: { status: "PUBLISHED" },
      include: { translations: true },
      orderBy: { order: "asc" },
    });

    services = dbServices.map((s) => ({
      id: s.id,
      slug: s.slug,
      icon: s.icon,
      translation: s.translations.find((t) => t.locale === locale) || s.translations[0],
    }));
  } catch {
    // Database not available
  }

  return (
    <>
      <Header locale={locale} dict={dict} />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <PageHeader title={dict.services.title} subtitle={dict.services.subtitle} />
          <ServicesList services={services} locale={locale} dict={dict} />
        </div>
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  );
}
