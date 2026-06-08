export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n/get-dictionary";
import { prisma } from "@/lib/prisma";
import { type Locale } from "@/lib/constants";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProjectDetail } from "@/components/projects/ProjectDetail";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  const dict = await getDictionary(locale);

  const project = await prisma.project.findUnique({
    where: { slug },
    include: {
      translations: true,
      categories: true,
      tags: true,
    },
  });

  if (!project) notFound();

  const translation = project.translations.find((t) => t.locale === locale)
    || project.translations.find((t) => t.locale === "en")
    || project.translations[0];

  if (!translation) notFound();

  const serializedProject = {
    ...project,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
    translation,
  };

  return (
    <>
      <Header locale={locale} dict={dict} />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <ProjectDetail project={serializedProject} locale={locale} dict={dict} />
        </div>
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  );
}
