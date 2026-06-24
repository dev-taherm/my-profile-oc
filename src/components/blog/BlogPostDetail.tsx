"use client";

import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type Locale } from "@/lib/constants";

interface BlogPostDetailProps {
  post: {
    slug: string;
    readingTime: number;
    publishedAt: string | null;
    tags: { slug: string; name: string }[];
    translation: {
      locale: string;
      title: string;
      excerpt: string;
      content: string;
    };
  };
  locale: Locale;
  dict: {
    blog: {
      backToBlog: string;
      minRead: string;
      publishedOn: string;
      by: string;
    };
  };
}

export function BlogPostDetail({ post, locale, dict }: BlogPostDetailProps) {
  const t = post.translation;

  return (
    <article className="max-w-3xl mx-auto">
      <Button
        variant="ghost"
        render={<Link href={`/${locale}/blog`} />}
        className="mb-8"
      >
        <ArrowLeft className={`${locale === "ar" ? "rtl:rotate-180" : ""} h-4 w-4 me-2`} />
        {dict.blog.backToBlog}
      </Button>

      <header className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Clock className="h-4 w-4" />
          <span>{post.readingTime} {dict.blog.minRead}</span>
          {post.publishedAt && (
            <>
              <span>·</span>
              <span>
                {dict.blog.publishedOn}{" "}
                <time dateTime={post.publishedAt}>
                  {new Date(post.publishedAt).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US")}
                </time>
              </span>
            </>
          )}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{t.title}</h1>
        <p className="text-lg text-muted-foreground">{t.excerpt}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {post.tags.map((tag) => (
            <Badge key={tag.slug} variant="secondary">
              {tag.name}
            </Badge>
          ))}
        </div>
      </header>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        {t.content.split("\n").map((line, i) => {
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
    </article>
  );
}
