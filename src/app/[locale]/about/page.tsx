import type { Metadata } from "next";
import { getDictionary } from "@/i18n/get-dictionary";
import { type Locale, siteConfig } from "@/lib/constants";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/shared/PageHeader";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { Briefcase, GraduationCap, Award, Languages } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const baseUrl = siteConfig.url;

  const titles: Record<Locale, string> = {
    en: "About Taher Mahram — Software Engineer Profile",
    ar: "عن طاهر محرم — ملف مهندس البرمجيات",
  };

  const descriptions: Record<Locale, string> = {
    en: "Learn about Taher Mahram's experience, education, and skills as a software engineer specializing in backend systems, AI, and scalable architectures.",
    ar: "تعرّف على خبرات طاهر محرم وتعليماته ومهاراته كمهندس برمجيات متخصص في الأنظمة الخلفية والذكاء الاصطناعي والهندسة المعمارية القابلة للتوسع.",
  };

  return {
    title: titles[locale],
    description: descriptions[locale],
    alternates: {
      canonical: `${baseUrl}/${locale}/about`,
      languages: {
        "en": `${baseUrl}/en/about`,
        "ar": `${baseUrl}/ar/about`,
        "x-default": `${baseUrl}/en/about`,
      },
    },
    openGraph: {
      title: titles[locale],
      description: descriptions[locale],
      url: `${baseUrl}/${locale}/about`,
      type: "profile",
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

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const dict = await getDictionary(locale);

  const experiences = [
    {
      company: dict.experience.neoPlatrix.company,
      role: dict.experience.neoPlatrix.role,
      period: dict.experience.neoPlatrix.period,
      highlights: dict.experience.neoPlatrix.highlights,
    },
    {
      company: dict.experience.pixova.company,
      role: dict.experience.pixova.role,
      period: dict.experience.pixova.period,
      highlights: dict.experience.pixova.highlights,
    },
    {
      company: dict.experience.khebrat.company,
      role: dict.experience.khebrat.role,
      period: dict.experience.khebrat.period,
      highlights: dict.experience.khebrat.highlights,
    },
  ];

  return (
    <>
      <Header locale={locale} dict={dict} />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <PageHeader title={dict.about.title} subtitle={dict.about.subtitle} />

          <div className="max-w-3xl mx-auto space-y-16">
            <AnimatedSection>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-lg leading-relaxed">{dict.about.summary}</p>
                <p className="text-muted-foreground">{dict.about.mission}</p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <div className="flex items-center gap-3 mb-6">
                <Briefcase className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">{dict.about.experience}</h2>
              </div>
              <div className="space-y-8 relative before:absolute before:inset-0 before:ms-6 before:ms-0 before:w-px before:bg-border">
                {experiences.map((exp, index) => (
                  <div key={index} className="relative ps-12">
                    <div className="absolute start-0 w-3 h-3 rounded-full bg-primary border-2 border-background top-1.5" />
                    <div className="p-6 rounded-xl border bg-card">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-3">
                        <h3 className="font-bold text-lg">{exp.role}</h3>
                        <Badge variant="secondary">{exp.period}</Badge>
                      </div>
                      <p className="text-primary font-medium mb-3">{exp.company}</p>
                      <ul className="space-y-2">
                        {exp.highlights.map((highlight, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex gap-2">
                            <span className="text-primary mt-1.5 shrink-0">•</span>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="flex items-center gap-3 mb-6">
                <GraduationCap className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">{dict.about.education}</h2>
              </div>
              <div className="p-6 rounded-xl border bg-card">
                <h3 className="font-bold text-lg">
                  B.Sc. in Computer Science (Software Development), with Honors
                </h3>
                <p className="text-primary font-medium">Universiti Teknikal Malaysia Melaka (UTeM)</p>
                <p className="text-sm text-muted-foreground mt-1">Malaysia · 2018–2022</p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <div className="flex items-center gap-3 mb-6">
                <Award className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">{dict.about.certifications}</h2>
              </div>
              <div className="space-y-3">
                <div className="p-4 rounded-xl border bg-card">
                  <p className="font-medium">LLM & AI Systems (Self-study: LangChain, RAG Pipelines)</p>
                </div>
                <div className="p-4 rounded-xl border bg-card">
                  <p className="font-medium">Udemy: LLM Engineering & LangChain Courses</p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.4}>
              <div className="flex items-center gap-3 mb-6">
                <Languages className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Languages</h2>
              </div>
              <div className="flex gap-3">
                <Badge variant="outline" className="text-base py-1.5 px-4">Arabic — Native</Badge>
                <Badge variant="outline" className="text-base py-1.5 px-4">English — Professional</Badge>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  );
}
