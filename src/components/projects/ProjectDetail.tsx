"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
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
    projectImages: { url: string; order: number }[];
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
  const sortedImages = project.projectImages?.sort((a, b) => a.order - b.order) || [];
  const [currentImage, setCurrentImage] = useState(0);

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

      {sortedImages.length > 0 && (
        <div className="mb-8">
          <div className="relative">
            <img
              src={sortedImages[currentImage].url}
              alt={t.title}
              className="w-full h-80 object-cover rounded-xl"
            />
            {sortedImages.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImage((prev) => (prev === 0 ? sortedImages.length - 1 : prev - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background rounded-full p-2 backdrop-blur-sm"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setCurrentImage((prev) => (prev === sortedImages.length - 1 ? 0 : prev + 1))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background rounded-full p-2 backdrop-blur-sm"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
          {sortedImages.length > 1 && (
            <div className="flex gap-2 mt-3 justify-center">
              {sortedImages.map((img, i) => (
                <button
                  key={img.url}
                  onClick={() => setCurrentImage(i)}
                  className={`rounded-md overflow-hidden border-2 transition-colors ${i === currentImage ? "border-primary" : "border-transparent"}`}
                >
                  <img src={img.url} alt="" className="h-14 w-20 object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

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
