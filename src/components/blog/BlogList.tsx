"use client";

import { useState, useMemo } from "react";
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
  categories: { slug: string; name: string }[];
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
      all: string;
      categories: string;
      tags: string;
      minRead: string;
      publishedOn: string;
    };
  };
}

export function BlogList({ posts, locale, dict }: BlogListProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allCategories = useMemo(() => {
    const map = new Map<string, string>();
    posts.forEach((p) => p.categories.forEach((c) => map.set(c.slug, c.name)));
    return Array.from(map.entries()).map(([slug, name]) => ({ slug, name }));
  }, [posts]);

  const allTags = useMemo(() => {
    const map = new Map<string, string>();
    posts.forEach((p) => p.tags.forEach((t) => map.set(t.slug, t.name)));
    return Array.from(map.entries()).map(([slug, name]) => ({ slug, name }));
  }, [posts]);

  const filtered = posts.filter((p) => {
    const t = p.translations.find((tr) => tr.locale === locale)
      || p.translations.find((tr) => tr.locale === "en")
      || p.translations[0];
    if (!t) return false;

    if (selectedCategory && !p.categories.some((c) => c.slug === selectedCategory)) return false;
    if (selectedTag && !p.tags.some((tag) => tag.slug === selectedTag)) return false;

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

      {allCategories.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium text-muted-foreground mb-2">{dict.blog.categories}</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${selectedCategory === null ? "bg-primary text-primary-foreground" : "bg-background hover:bg-accent"}`}
            >
              {dict.blog.all}
            </button>
            {allCategories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(selectedCategory === cat.slug ? null : cat.slug)}
                className={`px-3 py-1 rounded-full text-sm border transition-colors ${selectedCategory === cat.slug ? "bg-primary text-primary-foreground" : "bg-background hover:bg-accent"}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {allTags.length > 0 && (
        <div className="mb-8">
          <p className="text-sm font-medium text-muted-foreground mb-2">{dict.blog.tags}</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${selectedTag === null ? "bg-primary text-primary-foreground" : "bg-background hover:bg-accent"}`}
            >
              {dict.blog.all}
            </button>
            {allTags.map((tag) => (
              <button
                key={tag.slug}
                onClick={() => setSelectedTag(selectedTag === tag.slug ? null : tag.slug)}
                className={`px-3 py-1 rounded-full text-sm border transition-colors ${selectedTag === tag.slug ? "bg-primary text-primary-foreground" : "bg-background hover:bg-accent"}`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      )}

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
                  {post.categories.map((cat) => (
                    <Badge key={cat.slug} variant="outline" className="text-xs">
                      {cat.name}
                    </Badge>
                  ))}
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
