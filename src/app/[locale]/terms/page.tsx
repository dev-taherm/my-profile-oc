import type { Metadata } from "next";
import { getDictionary } from "@/i18n/get-dictionary";
import { type Locale, siteConfig } from "@/lib/constants";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/shared/PageHeader";
import { Breadcrumb } from "@/components/shared/Breadcrumb";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const baseUrl = siteConfig.url;

  const titles: Record<Locale, string> = {
    en: "Terms of Service — Taher Mahram",
    ar: "شروط الخدمة — طاهر محرم",
  };

  const descriptions: Record<Locale, string> = {
    en: "Terms and conditions for using taher.pixovagency.com.",
    ar: "الشروط والأحكام لاستخدام موقع taher.pixovagency.com.",
  };

  return {
    title: titles[locale],
    description: descriptions[locale],
    alternates: {
      canonical: `${baseUrl}/${locale}/terms`,
      languages: {
        "en": `${baseUrl}/en/terms`,
        "ar": `${baseUrl}/ar/terms`,
        "x-default": `${baseUrl}/en/terms`,
      },
    },
    openGraph: {
      title: titles[locale],
      description: descriptions[locale],
      url: `${baseUrl}/${locale}/terms`,
      type: "website",
    },
  };
}

export default async function TermsPage({
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
      { "@type": "ListItem", position: 2, name: dict.terms.title },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Header locale={locale} dict={dict} />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <PageHeader title={dict.terms.title} subtitle={dict.terms.subtitle} />
          <div className="max-w-3xl mx-auto">
            <Breadcrumb
              items={[
                { label: dict.breadcrumbs.home, href: `/${locale}` },
                { label: dict.terms.title },
              ]}
              locale={locale}
            />
            <p className="text-sm text-muted-foreground mb-8">{dict.terms.lastUpdated}</p>
            <div className="space-y-8">
              {dict.terms.sections.map((section, i) => (
                <section key={i}>
                  <h2 className="text-xl font-bold mb-3">{section.heading}</h2>
                  <p className="text-muted-foreground leading-relaxed">{section.content}</p>
                </section>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  );
}
