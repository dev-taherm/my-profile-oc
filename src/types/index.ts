export type { Locale } from "@/lib/constants";

export interface ProjectData {
  id: string;
  slug: string;
  image: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
  featured: boolean;
  status: string;
  categories: { slug: string; name: string }[];
  tags: { slug: string; name: string }[];
  translations: {
    locale: string;
    title: string;
    description: string;
    content: string | null;
  }[];
}

export interface BlogPostData {
  id: string;
  slug: string;
  coverImage: string | null;
  readingTime: number;
  featured: boolean;
  status: string;
  publishedAt: string | null;
  createdAt: string;
  author: { name: string | null };
  categories: { slug: string; name: string }[];
  tags: { slug: string; name: string }[];
  translations: {
    locale: string;
    title: string;
    excerpt: string;
    content: string;
  }[];
}

export interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}
