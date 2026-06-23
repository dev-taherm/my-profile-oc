"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { WhatsappIcon } from "@/components/shared/Icons";
import { type Locale, siteConfig } from "@/lib/constants";

interface CTAProps {
  locale: Locale;
  dict: {
    home: {
      cta: { title: string; subtitle: string; button: string };
    };
  };
}

export function CTA({ locale, dict }: CTAProps) {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
      <div className="container mx-auto px-4 relative text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold mb-4"
        >
          {dict.home.cta.title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          viewport={{ once: true }}
          className="text-lg text-muted-foreground max-w-xl mx-auto mb-8"
        >
          {dict.home.cta.subtitle}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Button
            size="lg"
            render={
              <a
                href={`https://wa.me/${siteConfig.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
          >
            {dict.home.cta.button}
            <WhatsappIcon className={`${locale === "ar" ? "rtl:rotate-180 ms-2" : "ms-2"} h-4 w-4`} />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
