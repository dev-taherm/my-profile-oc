import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary } from "@/i18n/get-dictionary";
import { prisma } from "@/lib/prisma";
import { type Locale, siteConfig } from "@/lib/constants";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ServiceDetail } from "@/components/services/ServiceDetail";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  const baseUrl = siteConfig.url;

  const service = await prisma.service.findUnique({
    where: { slug },
    include: { translations: true },
  });

  if (!service) return {};

  const t = service.translations.find((tr) => tr.locale === locale) || service.translations[0];

  const url = `${baseUrl}/${locale}/services/${slug}`;

  return {
    title: t?.title,
    description: t?.shortDesc,
    alternates: {
      canonical: url,
      languages: {
        "en": `${baseUrl}/en/services/${slug}`,
        "ar": `${baseUrl}/ar/services/${slug}`,
        "x-default": `${baseUrl}/en/services/${slug}`,
      },
    },
    openGraph: {
      title: t?.title,
      description: t?.shortDesc,
      url,
      type: "website",
      images: [{ url: `${baseUrl}/images/profile.jpg`, width: 1200, height: 630, alt: t?.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: t?.title,
      description: t?.shortDesc,
      images: [`${baseUrl}/images/profile.jpg`],
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  const dict = await getDictionary(locale);

  const service = await prisma.service.findUnique({
    where: { slug },
    include: { translations: true },
  });

  if (!service) notFound();

  const translation = service.translations.find((t) => t.locale === locale) || service.translations[0];

  if (!translation) notFound();

  const baseUrl = siteConfig.url;
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: translation.title,
    description: translation.description?.substring(0, 300),
    url: `${baseUrl}/${locale}/services/${slug}`,
    provider: {
      "@type": "Person",
      name: siteConfig.name,
      url: baseUrl,
    },
    inLanguage: locale,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: locale === "ar" ? "الرئيسية" : "Home", item: `${baseUrl}/${locale}` },
      { "@type": "ListItem", position: 2, name: dict.services.title, item: `${baseUrl}/${locale}/services` },
      { "@type": "ListItem", position: 3, name: translation.title },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Header locale={locale} dict={dict} />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <ServiceDetail
            service={{
              slug: service.slug,
              icon: service.icon,
              translation: {
                title: translation.title,
                description: translation.description,
                features: translation.features,
              },
            }}
            locale={locale}
            dict={dict}
          />
        </div>
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  );
}
