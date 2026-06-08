import { locales, defaultLocale, type Locale } from "@/lib/constants";

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export function getLocaleFromPathname(pathname: string): Locale {
  const segments = pathname.split("/");
  const firstSegment = segments[1];
  if (firstSegment && isValidLocale(firstSegment)) {
    return firstSegment;
  }
  return defaultLocale;
}

export function getLocaleFromHeaders(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale;
  const preferred = acceptLanguage
    .split(",")
    .map((lang) => {
      const [code, q] = lang.trim().split(";");
      return { code: code.split("-")[0], q: q ? parseFloat(q.split("=")[1]) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { code } of preferred) {
    if (isValidLocale(code)) return code;
  }
  return defaultLocale;
}
