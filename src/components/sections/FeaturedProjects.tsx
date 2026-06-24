"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type Locale } from "@/lib/constants";

interface Project {
  id: string;
  slug: string;
  projectImages: { url: string; order: number }[];
  featured: boolean;
  categories: { slug: string; name: string }[];
  tags: { slug: string; name: string }[];
  translations: {
    locale: string;
    title: string;
    description: string;
  }[];
}

interface FeaturedProjectsProps {
  projects: Project[];
  locale: Locale;
  dict: {
    home: {
      featuredProjects: { title: string; subtitle: string; viewAll: string };
    };
  };
}

export function FeaturedProjects({ projects, locale, dict }: FeaturedProjectsProps) {
  if (projects.length === 0) return null;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl font-bold text-center mb-3"
        >
          {dict.home.featuredProjects.title}
        </motion.h2>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-10">
          {dict.home.featuredProjects.subtitle}
        </p>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {projects.map((project, index) => {
            const t = project.translations.find((tr) => tr.locale === locale)
              || project.translations.find((tr) => tr.locale === "en")
              || project.translations[0];
            if (!t) return null;

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  href={`/${locale}/projects/${project.slug}`}
                  className="group block p-6 rounded-xl border bg-card hover:shadow-lg transition-all h-full"
                >
                  {project.projectImages?.length > 0 && (
                    <div className="relative w-full h-40 rounded-md mb-4 overflow-hidden">
                      <Image
                        src={project.projectImages[0].url}
                        alt={t.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {t.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {t.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.categories.map((cat) => (
                      <Badge key={cat.slug} variant="outline" className="text-xs">
                        {cat.name}
                      </Badge>
                    ))}
                    {project.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag.slug} variant="secondary" className="text-xs">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
        <div className="text-center">
          <Button
            variant="outline"
            render={<Link href={`/${locale}/projects`} />}
          >
            {dict.home.featuredProjects.viewAll} →
          </Button>
        </div>
      </div>
    </section>
  );
}
