import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary } from "@/i18n/get-dictionary";
import { prisma } from "@/lib/prisma";
import { type Locale } from "@/lib/constants";
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

  const service = await prisma.service.findUnique({
    where: { slug },
    include: { translations: true },
  });

  if (!service) return {};

  const t = service.translations.find((tr) => tr.locale === locale) || service.translations[0];

  return {
    title: t?.title,
    description: t?.shortDesc,
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

  return (
    <>
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
