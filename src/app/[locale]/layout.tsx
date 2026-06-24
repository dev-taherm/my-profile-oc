import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { locales, localeConfig, type Locale } from "@/lib/constants";
import { siteConfig } from "@/lib/constants";
import { getDictionary } from "@/i18n/get-dictionary";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LocaleSetter } from "@/components/shared/LocaleSetter";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateStaticParams(): Promise<{ locale: Locale }[]> {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const dict = await getDictionary(locale);
  const baseUrl = siteConfig.url;
  const geo = localeConfig[locale];

  return {
    title: {
      default: `${dict.hero.name} — ${dict.hero.title}`,
      template: `%s | ${dict.hero.name}`,
    },
    description: dict.hero.subtitle,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        ...Object.fromEntries(
          locales.map((l) => [localeConfig[l].hreflang, `${baseUrl}/${l}`])
        ),
        "x-default": `${baseUrl}/en`,
      },
    },
    openGraph: {
      title: `${dict.hero.name} — ${dict.hero.title}`,
      description: dict.hero.subtitle,
      url: `${baseUrl}/${locale}`,
      siteName: dict.hero.name,
      locale: geo.ogLocale,
      type: "website",
      images: [
        {
          url: `${baseUrl}/api/og?title=${encodeURIComponent(dict.hero.name)}&subtitle=${encodeURIComponent(dict.hero.title)}&locale=${locale}`,
          width: 1200,
          height: 630,
          alt: dict.hero.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@dev_taher",
      title: `${dict.hero.name} — ${dict.hero.title}`,
      description: dict.hero.subtitle,
      images: [`${baseUrl}/api/og?title=${encodeURIComponent(dict.hero.name)}&subtitle=${encodeURIComponent(dict.hero.title)}&locale=${locale}`],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;

  return (
    <div className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <LocaleSetter locale={locale} />
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>{children}</TooltipProvider>
      </ThemeProvider>
    </div>
  );
}
