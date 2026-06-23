import type { Metadata } from "next";
import { getDictionary } from "@/i18n/get-dictionary";
import { type Locale, siteConfig } from "@/lib/constants";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/shared/PageHeader";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactInfo } from "@/components/contact/ContactInfo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const baseUrl = siteConfig.url;

  const titles: Record<Locale, string> = {
    en: "Contact Taher Mahram — Hire a Software Engineer",
    ar: "تواصل مع طاهر محرم — توظيف مهندس برمجيات",
  };

  const descriptions: Record<Locale, string> = {
    en: "Get in touch with Taher Mahram for software engineering projects, backend development, AI integration, or freelance opportunities.",
    ar: "تواصل مع طاهر محرم لمشاريع هندسة البرمجيات أو تطوير الأنظمة الخلفية أو دمج الذكاء الاصطناعي أو الفرص الحرة.",
  };

  return {
    title: titles[locale],
    description: descriptions[locale],
    alternates: {
      canonical: `${baseUrl}/${locale}/contact`,
      languages: {
        "en": `${baseUrl}/en/contact`,
        "ar": `${baseUrl}/ar/contact`,
        "x-default": `${baseUrl}/en/contact`,
      },
    },
    openGraph: {
      title: titles[locale],
      description: descriptions[locale],
      url: `${baseUrl}/${locale}/contact`,
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

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const dict = await getDictionary(locale);

  const baseUrl = siteConfig.url;
  const descriptions: Record<Locale, string> = {
    en: "Get in touch with Taher Mahram for software engineering projects, backend development, AI integration, or freelance opportunities.",
    ar: "تواصل مع طاهر محرم لمشاريع هندسة البرمجيات أو تطوير الأنظمة الخلفية أو دمج الذكاء الاصطناعي أو الفرص الحرة.",
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: locale === "ar" ? "الرئيسية" : "Home", item: `${baseUrl}/${locale}` },
      { "@type": "ListItem", position: 2, name: dict.contact.title },
    ],
  };

  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: dict.contact.title,
    description: descriptions[locale],
    url: `${baseUrl}/${locale}/contact`,
    mainEntity: {
      "@type": "Person",
      name: siteConfig.name,
      url: baseUrl,
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "email",
          email: siteConfig.email,
        },
        {
          "@type": "ContactPoint",
          contactType: "customer service",
          telephone: siteConfig.whatsapp,
          contactOption: "WhatsApp",
          availableLanguage: ["English", "Arabic"],
        },
      ],
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }} />
      <Header locale={locale} dict={dict} />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <PageHeader title={dict.contact.title} subtitle={dict.contact.subtitle} />
          <Breadcrumb
            items={[
              { label: dict.breadcrumbs.home, href: `/${locale}` },
              { label: dict.contact.title },
            ]}
            locale={locale}
          />
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
            <ContactForm dict={dict} />
            <ContactInfo dict={dict} />
          </div>
        </div>
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  );
}
