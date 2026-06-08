export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
};

export const siteConfig = {
  name: "Taher Mahram",
  title: "Taher Mahram — Software Engineer",
  description:
    "Software Engineer specializing in backend and AI systems, with experience designing scalable, microservices-oriented architectures and integrating LLMs into production workflows.",
  url: "https://tahermahram.dev",
  author: "Taher Mahram",
  email: "tahermahram0@gmail.com",
  phone: "+967 779991263",
  location: "Sana'a, Yemen",
  github: "https://github.com/dev-taherm",
  linkedin: "https://linkedin.com/in/taher-mahram",
};

export const navItems = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "projects", href: "/projects" },
  { key: "blog", href: "/blog" },
  { key: "resume", href: "/resume" },
  { key: "contact", href: "/contact" },
] as const;
