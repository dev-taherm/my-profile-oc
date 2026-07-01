export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n/get-dictionary";
import { prisma } from "@/lib/prisma";
import { type Locale } from "@/lib/constants";
import { getSiteProfile } from "@/lib/profile";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { BlogPostDetail } from "@/components/blog/BlogPostDetail";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  const profile = await getSiteProfile();
  const baseUrl = profile.url;

  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: { translations: true },
  });

  if (!post) return {};

  const t = post.translations.find((tr) => tr.locale === locale) || post.translations[0];
  if (!t) return {};

  const url = `${baseUrl}/${locale}/blog/${slug}`;

  return {
    title: t.title,
    description: t.excerpt || t.content?.substring(0, 160),
    alternates: {
      canonical: url,
      languages: {
        "en": `${baseUrl}/en/blog/${slug}`,
        "ar": `${baseUrl}/ar/blog/${slug}`,
        "x-default": `${baseUrl}/en/blog/${slug}`,
      },
    },
    openGraph: {
      title: t.title,
      description: t.excerpt || t.content?.substring(0, 160),
      url,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      images: post.coverImage ? [{ url: post.coverImage, width: 1200, height: 630, alt: t.title }] : [{ url: `${baseUrl}/api/og?title=${encodeURIComponent(t.title)}&subtitle=${encodeURIComponent(t.excerpt || "")}&locale=${locale}`, width: 1200, height: 630, alt: t.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: t.title,
      description: t.excerpt || t.content?.substring(0, 160),
      images: [post.coverImage || `${baseUrl}/api/og?title=${encodeURIComponent(t.title)}&subtitle=${encodeURIComponent(t.excerpt || "")}&locale=${locale}`],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  const dict = await getDictionary(locale);
  const profile = await getSiteProfile();

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

  const baseUrl = profile.url;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: translation.title,
    description: translation.excerpt || translation.content?.substring(0, 200),
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    url: `${baseUrl}/${locale}/blog/${slug}`,
    author: {
      "@type": "Person",
      name: post.author?.name || profile.name,
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: profile.name,
      url: baseUrl,
    },
    image: post.coverImage || `${baseUrl}/images/profile.jpg`,
    inLanguage: locale,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: locale === "ar" ? "الرئيسية" : "Home", item: `${baseUrl}/${locale}` },
      { "@type": "ListItem", position: 2, name: dict.blog.title, item: `${baseUrl}/${locale}/blog` },
      { "@type": "ListItem", position: 3, name: translation.title },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Header locale={locale} dict={dict} />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <Breadcrumb
            items={[
              { label: dict.breadcrumbs.home, href: `/${locale}` },
              { label: dict.blog.title, href: `/${locale}/blog` },
              { label: translation.title },
            ]}
            locale={locale}
          />
          <BlogPostDetail post={serializedPost} locale={locale} dict={dict} />
        </div>
      </main>
      <Footer locale={locale} dict={dict} profile={profile} />
    </>
  );
}
