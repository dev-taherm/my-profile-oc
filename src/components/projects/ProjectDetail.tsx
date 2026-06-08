"use client";

import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/shared/Icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type Locale } from "@/lib/constants";

interface ProjectDetailProps {
  project: {
    slug: string;
    githubUrl: string | null;
    liveUrl: string | null;
    featured: boolean;
    categories: { slug: string; name: string }[];
    tags: { slug: string; name: string }[];
    translation: {
      locale: string;
      title: string;
      description: string;
      content: string | null;
    };
  };
  locale: Locale;
  dict: {
    projects: {
      backToProjects: string;
      viewLive: string;
      viewGithub: string;
    };
  };
}

export function ProjectDetail({ project, locale, dict }: ProjectDetailProps) {
  const t = project.translation;

  return (
    <div className="max-w-3xl mx-auto">
      <Button
        variant="ghost"
        render={<Link href={`/${locale}/projects`} />}
        className="mb-8"
      >
        <ArrowLeft className={`${locale === "ar" ? "rtl:rotate-180" : ""} h-4 w-4 me-2`} />
        {dict.projects.backToProjects}
      </Button>

      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <h1 className="text-3xl md:text-4xl font-bold">{t.title}</h1>
          {project.featured && <Badge>Featured</Badge>}
        </div>
        <p className="text-lg text-muted-foreground">{t.description}</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {project.tags.map((tag) => (
          <Badge key={tag.slug} variant="secondary">
            {tag.name}
          </Badge>
        ))}
      </div>

      <div className="flex gap-3 mb-8">
        {project.liveUrl && (
          <Button
            render={
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" />
            }
          >
            {dict.projects.viewLive}
            <ExternalLink className="ms-2 h-4 w-4" />
          </Button>
        )}
        {project.githubUrl && (
          <Button
            variant="outline"
            render={
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" />
            }
          >
            {dict.projects.viewGithub}
            <GithubIcon className="ms-2 h-4 w-4" />
          </Button>
        )}
      </div>

      {t.content && (
        <div className="prose prose-lg dark:prose-invert max-w-none">
          {t.content.split("\n").map((line, i) => {
            if (line.startsWith("## ")) {
              return <h2 key={i} className="text-2xl font-bold mt-8 mb-4">{line.slice(3)}</h2>;
            }
            if (line.startsWith("- ")) {
              return <li key={i} className="text-muted-foreground">{line.slice(2)}</li>;
            }
            if (line.trim() === "") return <br key={i} />;
            return <p key={i} className="text-muted-foreground leading-relaxed">{line}</p>;
          })}
        </div>
      )}
    </div>
  );
}
