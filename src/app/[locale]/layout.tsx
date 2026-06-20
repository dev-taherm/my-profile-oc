import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { locales, type Locale } from "@/lib/constants";
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
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  return {
    title: {
      default: `${dict.hero.name} — ${dict.hero.title}`,
      template: `%s | ${dict.hero.name}`,
    },
    description: dict.hero.subtitle,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: Object.fromEntries(
        locales.map((l) => [l, `${baseUrl}/${l}`])
      ),
    },
    openGraph: {
      title: `${dict.hero.name} — ${dict.hero.title}`,
      description: dict.hero.subtitle,
      url: `${baseUrl}/${locale}`,
      siteName: dict.hero.name,
      locale: locale === "ar" ? "ar_SA" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${dict.hero.name} — ${dict.hero.title}`,
      description: dict.hero.subtitle,
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
