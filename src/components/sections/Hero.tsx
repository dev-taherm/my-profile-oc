"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon, FacebookIcon, WhatsappIcon } from "@/components/shared/Icons";
import { Button } from "@/components/ui/button";
import { type Locale, siteConfig } from "@/lib/constants";

interface HeroProps {
  locale: Locale;
  dict: {
    hero: {
      greeting: string;
      name: string;
      title: string;
      subtitle: string;
      description: string;
      cta_projects: string;
      cta_contact: string;
      cta_resume: string;
    };
  };
}

export function Hero({ locale, dict }: HeroProps) {
  const dir = locale === "ar" ? -1 : 1;

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
      <div className="container mx-auto px-4 py-20 md:py-32 relative">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 * dir }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex-1 text-center md:text-start"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-muted-foreground mb-2"
            >
              {dict.hero.greeting}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4"
            >
              {dict.hero.name}{" "}
              <span className="text-primary">— {dict.hero.title}</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-lg text-muted-foreground max-w-xl mb-4"
            >
              {dict.hero.subtitle}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.6 }}
              className="text-base text-muted-foreground/80 max-w-xl mb-8"
            >
              {dict.hero.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-wrap gap-4 justify-center md:justify-start"
            >
              <Button
                size="lg"
                render={
                  <Link href={`/${locale}/projects`} />
                }
              >
                {dict.hero.cta_projects}
                <ArrowRight className={`${locale === "ar" ? "rtl:rotate-180 ms-2" : "ms-2"} h-4 w-4`} />
              </Button>
              <Button
                variant="outline"
                size="lg"
                render={
                  <a href={`https://wa.me/${siteConfig.whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" />
                }
              >
                {dict.hero.cta_contact}
                <WhatsappIcon className={`${locale === "ar" ? "rtl:rotate-180 ms-2" : "ms-2"} h-4 w-4`} />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-3 mt-8 justify-center md:justify-start"
            >
              <Link
                href={siteConfig.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <GithubIcon className="h-5 w-5" />
              </Link>
              <Link
                href={siteConfig.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <LinkedinIcon className="h-5 w-5" />
              </Link>
              <Link
                href={siteConfig.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <InstagramIcon className="h-5 w-5" />
              </Link>
              <Link
                href={siteConfig.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <FacebookIcon className="h-5 w-5" />
              </Link>
              <Link
                href={`mailto:${siteConfig.email}`}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="h-5 w-5" />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex-shrink-0"
          >
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-primary/20 shadow-2xl">
              <Image
                src="/images/profile.jpg"
                alt={dict.hero.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 256px, 320px"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
