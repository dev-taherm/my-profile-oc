"use client";

import Link from "next/link";
import ReactMarkdown from "react-markdown";
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
        <ReactMarkdown>{t.content}</ReactMarkdown>
      </div>
    </article>
  );
}
