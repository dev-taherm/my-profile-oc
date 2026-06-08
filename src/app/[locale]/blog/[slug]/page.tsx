export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n/get-dictionary";
import { prisma } from "@/lib/prisma";
import { type Locale } from "@/lib/constants";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BlogPostDetail } from "@/components/blog/BlogPostDetail";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  const dict = await getDictionary(locale);

  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: {
      translations: true,
      categories: true,
      tags: true,
      author: { select: { name: true } },
    },
  });

  if (!post) notFound();

  const translation = post.translations.find((t) => t.locale === locale)
    || post.translations.find((t) => t.locale === "en")
    || post.translations[0];

  if (!translation) notFound();

  const serializedPost = {
    ...post,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    publishedAt: post.publishedAt?.toISOString() ?? null,
    translation,
  };

  return (
    <>
      <Header locale={locale} dict={dict} />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <BlogPostDetail post={serializedPost} locale={locale} dict={dict} />
        </div>
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  );
}
