import Link from "next/link";
import Image from "next/image";
import { Mail, Heart } from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon, FacebookIcon } from "@/components/shared/Icons";
import { siteConfig, type Locale } from "@/lib/constants";

interface FooterProps {
  locale: Locale;
  dict: {
    footer: {
      copyright: string;
      builtWith: string;
    };
  };
}

export function Footer({ locale, dict }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href={`/${locale}`} className="flex items-center">
              <Image src="/images/logo.png" alt="TM" width={28} height={28} className="dark:hidden" />
              <Image src="/images/logoForDarckTheme.png" alt="TM" width={28} height={28} className="hidden dark:block" />
            </Link>
            <p className="text-sm text-muted-foreground">
              © {year} {siteConfig.author}. {dict.footer.copyright}
            </p>
          </div>

          <div className="flex items-center gap-1">
            <Link
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <GithubIcon className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link
              href={siteConfig.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <LinkedinIcon className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
            <Link
              href={siteConfig.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <InstagramIcon className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link
              href={siteConfig.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <FacebookIcon className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link
              href={`mailto:${siteConfig.email}`}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Mail className="h-5 w-5" />
              <span className="sr-only">Email</span>
            </Link>
          </div>

          <p className="text-xs text-muted-foreground flex items-center gap-1">
            {dict.footer.builtWith} <Heart className="h-3 w-3 text-red-500 fill-current" />
          </p>
        </div>
      </div>
    </footer>
  );
}
