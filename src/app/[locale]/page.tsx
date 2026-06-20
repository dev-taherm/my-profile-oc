import type { Metadata } from "next";
import { getDictionary } from "@/i18n/get-dictionary";
import { type Locale, siteConfig } from "@/lib/constants";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { FeaturedTech } from "@/components/sections/FeaturedTech";

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
    openGraph: {
      title: titles[locale],
      description: descriptions[locale],
      url: `${baseUrl}/${locale}`,
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

  return (
    <>
      <Header locale={locale} dict={dict} />
      <main className="flex-1">
        <Hero locale={locale} dict={dict} />
        <Stats dict={dict} />
        <FeaturedTech dict={dict} />
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  );
}
