import type { Metadata } from "next";
import { getDictionary } from "@/i18n/get-dictionary";
import { type Locale } from "@/lib/constants";
import { getSiteProfile } from "@/lib/profile";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/shared/PageHeader";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { Briefcase, GraduationCap, Award, Languages, HelpCircle, Workflow } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const profile = await getSiteProfile();
  const baseUrl = profile.url;

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

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const dict = await getDictionary(locale);
  const profile = await getSiteProfile();

  const experiences = profile.experiences;

  const baseUrl = profile.url;
  const descriptions: Record<Locale, string> = {
    en: "Learn about Taher Mahram's experience, education, and skills as a software engineer specializing in backend systems, AI, and scalable architectures.",
    ar: "تعرّف على خبرات طاهر محرم وتعليماته ومهاراته كمهندس برمجيات متخصص في الأنظمة الخلفية والذكاء الاصطناعي والهندسة المعمارية القابلة للتوسع.",
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: locale === "ar" ? "الرئيسية" : "Home", item: `${baseUrl}/${locale}` },
      { "@type": "ListItem", position: 2, name: dict.about.title },
    ],
  };

  const faqItems = dict.about.faq.items;
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const aboutPageSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: dict.about.title,
    description: descriptions[locale],
    url: `${baseUrl}/${locale}/about`,
    mainEntity: {
      "@type": "Person",
      name: profile.name,
      jobTitle: profile.title,
      hasOccupation: profile.experiences.map((exp) => ({
        "@type": "Occupation",
        name: exp.role,
        occupationLocation: { "@type": "Organization", name: exp.company },
      })),
      knowsAbout: profile.skillCategories.flatMap((sc) => sc.skills),
      alumniOf: profile.educations.map((edu) => ({
        "@type": "CollegeOrUniversity",
        name: edu.institution,
        educationalCredentialAward: edu.degree,
      })),
    },
  };

  const howToSteps = dict.about.process.steps;
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: dict.about.process.title,
    description: dict.about.process.subtitle,
    step: howToSteps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.description,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }} />
      <Header locale={locale} dict={dict} />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <PageHeader title={dict.about.title} subtitle={dict.about.subtitle} />
          <Breadcrumb
            items={[
              { label: dict.breadcrumbs.home, href: `/${locale}` },
              { label: dict.about.title },
            ]}
            locale={locale}
          />

          <div className="max-w-3xl mx-auto space-y-16">
            <AnimatedSection>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-lg leading-relaxed">{profile.aboutSummary || dict.about.summary}</p>
                <p className="text-muted-foreground">{profile.aboutMission || dict.about.mission}</p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <div className="flex items-center gap-3 mb-6">
                <Briefcase className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">{dict.about.experience}</h2>
              </div>
              <div className="space-y-8 relative before:absolute before:inset-0 before:ms-6 before:ms-0 before:w-px before:bg-border">
                {experiences.map((exp) => (
                  <div key={exp.id} className="relative ps-12">
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

            <AnimatedSection delay={0.15}>
              <div className="flex items-center gap-3 mb-6">
                <Workflow className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">{dict.about.process.title}</h2>
              </div>
              <p className="text-muted-foreground mb-6">{dict.about.process.subtitle}</p>
              <div className="grid gap-4 sm:grid-cols-2">
                {howToSteps.map((step, index) => (
                  <div key={index} className="p-5 rounded-xl border bg-card relative">
                    <div className="absolute -top-3 -start-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <h3 className="font-bold text-lg mb-2">{step.name}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="flex items-center gap-3 mb-6">
                <GraduationCap className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">{dict.about.education}</h2>
              </div>
              <div className="space-y-4">
                {profile.educations.map((edu) => (
                  <div key={edu.id} className="p-6 rounded-xl border bg-card">
                    <h3 className="font-bold text-lg">{edu.degree}</h3>
                    <p className="text-primary font-medium">{edu.institution}</p>
                    <p className="text-sm text-muted-foreground mt-1">{edu.location ? `${edu.location} · ` : ""}{edu.period}</p>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <div className="flex items-center gap-3 mb-6">
                <Award className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">{dict.about.certifications}</h2>
              </div>
              <div className="space-y-3">
                {profile.certifications.map((cert) => (
                  <div key={cert.id} className="p-4 rounded-xl border bg-card">
                    <p className="font-medium">{cert.title}</p>
                    {cert.issuer && <p className="text-sm text-muted-foreground">{cert.issuer}{cert.year ? ` · ${cert.year}` : ""}</p>}
                  </div>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.4}>
              <div className="flex items-center gap-3 mb-6">
                <Languages className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Languages</h2>
              </div>
              <div className="flex gap-3">
                {profile.languages.map((lang) => (
                  <Badge key={lang.id} variant="outline" className="text-base py-1.5 px-4">{lang.name} — {lang.level}</Badge>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.5}>
              <div className="flex items-center gap-3 mb-6">
                <HelpCircle className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">{dict.about.faq.title}</h2>
              </div>
              <div className="space-y-4">
                {faqItems.map((item, i) => (
                  <details key={i} className="group p-6 rounded-xl border bg-card">
                    <summary className="font-bold text-lg cursor-pointer list-none flex items-center justify-between">
                      {item.question}
                      <span className="text-muted-foreground group-open:rotate-180 transition-transform">▾</span>
                    </summary>
                    <p className="mt-4 text-muted-foreground leading-relaxed">{item.answer}</p>
                  </details>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </main>
      <Footer locale={locale} dict={dict} profile={profile} />
    </>
  );
}
