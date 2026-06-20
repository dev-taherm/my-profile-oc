export const dynamic = "force-dynamic";

import { getDictionary } from "@/i18n/get-dictionary";
import { prisma } from "@/lib/prisma";
import { type Locale } from "@/lib/constants";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/shared/PageHeader";
import { ServicesList } from "@/components/services/ServicesList";

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const dict = await getDictionary(locale);

  let services: React.ComponentProps<typeof ServicesList>["services"] = [];
  try {
    const dbServices = await prisma.service.findMany({
      where: { status: "PUBLISHED" },
      include: { translations: true },
      orderBy: { order: "asc" },
    });

    services = dbServices.map((s) => ({
      id: s.id,
      slug: s.slug,
      icon: s.icon,
      translation: s.translations.find((t) => t.locale === locale) || s.translations[0],
    }));
  } catch {
    // Database not available
  }

  return (
    <>
      <Header locale={locale} dict={dict} />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <PageHeader title={dict.services.title} subtitle={dict.services.subtitle} />
          <ServicesList services={services} locale={locale} dict={dict} />
        </div>
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  );
}
