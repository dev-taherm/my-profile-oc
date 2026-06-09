export const dynamic = "force-dynamic";

import { getDictionary } from "@/i18n/get-dictionary";
import { prisma } from "@/lib/prisma";
import { type Locale } from "@/lib/constants";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/shared/PageHeader";
import { ProjectsList } from "@/components/projects/ProjectsList";

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const dict = await getDictionary(locale);

  let serializedProjects: React.ComponentProps<typeof ProjectsList>["projects"] = [];
  try {
    const projects = await prisma.project.findMany({
      where: { status: "PUBLISHED" },
      include: {
        translations: true,
        categories: true,
        tags: true,
        projectImages: { orderBy: { order: "asc" as const } },
      },
      orderBy: { order: "asc" },
    });

    serializedProjects = projects.map((p) => ({
      ...p,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }));
  } catch {
    // Database not available
  }

  return (
    <>
      <Header locale={locale} dict={dict} />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <PageHeader title={dict.projects.title} subtitle={dict.projects.subtitle} />
          <ProjectsList projects={serializedProjects} locale={locale} dict={dict} />
        </div>
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  );
}
