"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink, Search } from "lucide-react";
import { GithubIcon } from "@/components/shared/Icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type Locale } from "@/lib/constants";

interface Project {
  id: string;
  slug: string;
  image: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
  featured: boolean;
  categories: { slug: string; name: string }[];
  tags: { slug: string; name: string }[];
  translations: {
    locale: string;
    title: string;
    description: string;
    content: string | null;
  }[];
}

interface ProjectsListProps {
  projects: Project[];
  locale: Locale;
  dict: {
    projects: {
      featured: string;
      viewProject: string;
      viewLive: string;
      viewGithub: string;
      search: string;
      all: string;
    };
  };
}

export function ProjectsList({ projects, locale, dict }: ProjectsListProps) {
  const [search, setSearch] = useState("");

  const filtered = projects.filter((p) => {
    const t = p.translations.find((tr) => tr.locale === locale)
      || p.translations.find((tr) => tr.locale === "en")
      || p.translations[0];
    if (!t) return false;
    const q = search.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      p.tags.some((tag) => tag.name.toLowerCase().includes(q))
    );
  });

  return (
    <div>
      <div className="mb-8 flex justify-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={dict.projects.search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ps-10"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {filtered.map((project, index) => {
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
                className="group block p-6 rounded-xl border bg-card hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                    {t.title}
                  </h3>
                  {project.featured && (
                    <Badge variant="default" className="shrink-0">
                      {dict.projects.featured}
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {t.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <Badge key={tag.slug} variant="secondary" className="text-xs">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-3">
                  {project.liveUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      render={
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                        />
                      }
                    >
                      {dict.projects.viewLive}
                      <ExternalLink className="ms-1.5 h-3 w-3" />
                    </Button>
                  )}
                  {project.githubUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      render={
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                        />
                      }
                    >
                      {dict.projects.viewGithub}
                      <GithubIcon className="ms-1.5 h-3 w-3" />
                    </Button>
                  )}
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
