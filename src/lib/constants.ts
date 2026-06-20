export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
};

export const localeConfig: Record<Locale, { hreflang: string; ogLocale: string }> = {
  en: { hreflang: "en-US", ogLocale: "en_US" },
  ar: { hreflang: "ar-SA", ogLocale: "ar_SA" },
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
  whatsapp: "+967733918465",
  location: "Sana'a, Yemen",
  github: "https://github.com/dev-taherm",
  linkedin: "https://www.linkedin.com/in/taher-mahram/",
  instagram: "https://instagram.com/dev_taher",
  facebook: "https://www.facebook.com/taher.ali.moharam",
};

export const navItems = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "services", href: "/services" },
  { key: "projects", href: "/projects" },
  { key: "blog", href: "/blog" },
  { key: "resume", href: "/resume" },
  { key: "contact", href: "/contact" },
] as const;
