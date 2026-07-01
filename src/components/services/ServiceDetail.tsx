"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Locale } from "@/lib/constants";
import { type SiteProfileData } from "@/lib/profile";

interface ServiceDetailProps {
  service: {
    slug: string;
    icon: string | null;
    translation: {
      title: string;
      description: string;
      features: string | null;
    };
  };
  locale: Locale;
  dict: {
    services: {
      backToServices: string;
      features: string;
      getInTouch: string;
    };
  };
  profile: SiteProfileData;
}

export function ServiceDetail({ service, locale, dict, profile }: ServiceDetailProps) {
  const t = service.translation;
  const features = t.features ? t.features.split("\n").filter((f) => f.trim()) : [];

  return (
    <article className="max-w-3xl mx-auto">
      <Button
        variant="ghost"
        render={<Link href={`/${locale}/services`} />}
        className="mb-8"
      >
        <ArrowLeft className={`${locale === "ar" ? "rtl:rotate-180" : ""} h-4 w-4 me-2`} />
        {dict.services.backToServices}
      </Button>

      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{t.title}</h1>
      </header>

      <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
        {t.description.split("\n").map((line, i) => {
          if (line.startsWith("## ")) {
            return <h2 key={i} className="text-2xl font-bold mt-8 mb-4">{line.slice(3)}</h2>;
          }
          if (line.startsWith("### ")) {
            return <h3 key={i} className="text-xl font-bold mt-6 mb-3">{line.slice(4)}</h3>;
          }
          if (line.startsWith("- ")) {
            return <li key={i} className="text-muted-foreground">{line.slice(2)}</li>;
          }
          if (line.startsWith("**") && line.endsWith("**")) {
            return <p key={i} className="font-bold">{line.slice(2, -2)}</p>;
          }
          if (line.trim() === "") return <br key={i} />;
          return <p key={i} className="text-muted-foreground leading-relaxed">{line}</p>;
        })}
      </div>

      {features.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{dict.services.features}</h2>
          <ul className="space-y-2">
            {features.map((feature, i) => (
              <li key={i} className="flex gap-2 text-muted-foreground">
                <span className="text-primary mt-1 shrink-0">✓</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8">
        <Button render={<a href={`https://wa.me/${profile.whatsapp?.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" />}>
          {dict.services.getInTouch}
        </Button>
      </div>
    </article>
  );
}
