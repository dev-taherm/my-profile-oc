"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Locale } from "@/lib/constants";

interface BlogPost {
  id: string;
  slug: string;
  coverImage: string | null;
  readingTime: number;
  publishedAt: string | null;
  translations: {
    locale: string;
    title: string;
    excerpt: string;
  }[];
}

interface LatestBlogProps {
  posts: BlogPost[];
  locale: Locale;
  dict: {
    home: {
      latestBlog: { title: string; viewAll: string };
    };
    blog: { minRead: string };
  };
}

export function LatestBlog({ posts, locale, dict }: LatestBlogProps) {
  if (posts.length === 0) return null;

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl font-bold text-center mb-10"
        >
          {dict.home.latestBlog.title}
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {posts.map((post, index) => {
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
                  {post.coverImage && (
                    <img
                      src={post.coverImage}
                      alt={t.title}
                      className="w-full h-40 object-cover rounded-md mb-4"
                    />
                  )}
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
                  <p className="text-muted-foreground line-clamp-2">
                    {t.excerpt}
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </div>
        <div className="text-center">
          <Button
            variant="outline"
            render={<Link href={`/${locale}/blog`} />}
          >
            {dict.home.latestBlog.viewAll} →
          </Button>
        </div>
      </div>
    </section>
  );
}
