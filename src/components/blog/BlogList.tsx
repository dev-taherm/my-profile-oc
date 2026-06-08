"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { type Locale } from "@/lib/constants";

interface BlogPost {
  id: string;
  slug: string;
  coverImage: string | null;
  readingTime: number;
  publishedAt: string | null;
  tags: { slug: string; name: string }[];
  translations: {
    locale: string;
    title: string;
    excerpt: string;
    content: string;
  }[];
}

interface BlogListProps {
  posts: BlogPost[];
  locale: Locale;
  dict: {
    blog: {
      readMore: string;
      search: string;
      minRead: string;
      publishedOn: string;
    };
  };
}

export function BlogList({ posts, locale, dict }: BlogListProps) {
  const [search, setSearch] = useState("");

  const filtered = posts.filter((p) => {
    const t = p.translations.find((tr) => tr.locale === locale)
      || p.translations.find((tr) => tr.locale === "en")
      || p.translations[0];
    if (!t) return false;
    const q = search.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      t.excerpt.toLowerCase().includes(q) ||
      p.tags.some((tag) => tag.name.toLowerCase().includes(q))
    );
  });

  return (
    <div>
      <div className="mb-8 flex justify-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={dict.blog.search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ps-10"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {filtered.map((post, index) => {
          const t = post.translations.find((tr) => tr.locale === locale)
            || post.translations.find((tr) => tr.locale === "en")
            || post.translations[0];

          if (!t) return null;

          return (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link
                href={`/${locale}/blog/${post.slug}`}
                className="group block p-6 rounded-xl border bg-card hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <Clock className="h-4 w-4" />
                  <span>{post.readingTime} {dict.blog.minRead}</span>
                  {post.publishedAt && (
                    <>
                      <span>·</span>
                      <span>{new Date(post.publishedAt).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US")}</span>
                    </>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {t.title}
                </h3>
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {t.excerpt}
                </p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
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
    </div>
  );
}
