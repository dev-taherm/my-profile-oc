import type { Metadata } from "next";
import { getDictionary } from "@/i18n/get-dictionary";
import { type Locale, siteConfig } from "@/lib/constants";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/shared/PageHeader";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { ResumeView } from "@/components/resume/ResumeView";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const baseUrl = siteConfig.url;

  const titles: Record<Locale, string> = {
    en: "Taher Mahram — Software Engineer Resume & CV",
    ar: "طاهر محرم — سيرة ذاتية لمهندس البرمجيات",
  };

  const descriptions: Record<Locale, string> = {
    en: "Professional resume of Taher Mahram — Software Engineer with experience in Django, Python, AI systems, and scalable backend architectures.",
    ar: "السيرة الذاتية المهنية لطاهر محرم — مهندس برمجيات ذو خبرة في Django وPython وأنظمة الذكاء الاصطناعي والهندسة المعمارية الخلفية القابلة للتوسع.",
  };

  return {
    title: titles[locale],
    description: descriptions[locale],
    alternates: {
      canonical: `${baseUrl}/${locale}/resume`,
      languages: {
        "en": `${baseUrl}/en/resume`,
        "ar": `${baseUrl}/ar/resume`,
        "x-default": `${baseUrl}/en/resume`,
      },
    },
    openGraph: {
      title: titles[locale],
      description: descriptions[locale],
      url: `${baseUrl}/${locale}/resume`,
      type: "profile",
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

export default async function ResumePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const dict = await getDictionary(locale);

  const baseUrl = siteConfig.url;
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: locale === "ar" ? "الرئيسية" : "Home", item: `${baseUrl}/${locale}` },
      { "@type": "ListItem", position: 2, name: dict.resume.title },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Header locale={locale} dict={dict} />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <PageHeader title={dict.resume.title} subtitle={dict.resume.subtitle} />
          <Breadcrumb
            items={[
              { label: dict.breadcrumbs.home, href: `/${locale}` },
              { label: dict.resume.title },
            ]}
            locale={locale}
          />
          <ResumeView dict={dict} />
        </div>
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  );
}
