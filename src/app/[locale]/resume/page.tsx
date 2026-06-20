import type { Metadata } from "next";
import { getDictionary } from "@/i18n/get-dictionary";
import { type Locale, siteConfig } from "@/lib/constants";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/shared/PageHeader";
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
    openGraph: {
      title: titles[locale],
      description: descriptions[locale],
      url: `${baseUrl}/${locale}/resume`,
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

  return (
    <>
      <Header locale={locale} dict={dict} />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <PageHeader title={dict.resume.title} subtitle={dict.resume.subtitle} />
          <ResumeView dict={dict} />
        </div>
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  );
}
