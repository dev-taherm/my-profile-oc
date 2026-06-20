import type { Metadata } from "next";
import { getDictionary } from "@/i18n/get-dictionary";
import { type Locale, siteConfig } from "@/lib/constants";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/shared/PageHeader";
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
    openGraph: {
      title: titles[locale],
      description: descriptions[locale],
      url: `${baseUrl}/${locale}/contact`,
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

  return (
    <>
      <Header locale={locale} dict={dict} />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <PageHeader title={dict.contact.title} subtitle={dict.contact.subtitle} />
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
