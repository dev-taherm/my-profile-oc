"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Code, Brain, Layers, Cloud, Search, Server, Database, Shield,
  Globe, Smartphone, Cpu, BarChart3,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type Locale } from "@/lib/constants";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code, Brain, Layers, Cloud, Search, Server, Database, Shield,
  Globe, Smartphone, Cpu, BarChart3,
};

interface ServiceItem {
  id: string;
  slug: string;
  icon: string | null;
  translation: {
    title: string;
    shortDesc: string;
  };
}

interface FeaturedServicesProps {
  services: ServiceItem[];
  locale: Locale;
  dict: {
    home: {
      featuredServices: { title: string; subtitle: string; viewAll: string };
    };
    services: { viewService: string };
  };
}

export function FeaturedServices({ services, locale, dict }: FeaturedServicesProps) {
  if (services.length === 0) return null;

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl font-bold text-center mb-3"
        >
          {dict.home.featuredServices.title}
        </motion.h2>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-10">
          {dict.home.featuredServices.subtitle}
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {services.map((service, index) => {
            const IconComponent = service.icon ? iconMap[service.icon] : Layers;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6 flex flex-col h-full">
                    <div className="mb-4">
                      {IconComponent && (
                        <div className="p-3 rounded-lg bg-primary/10 w-fit">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{service.translation.title}</h3>
                    <p className="text-muted-foreground flex-1 mb-4">{service.translation.shortDesc}</p>
                    <Button
                      variant="ghost"
                      render={<Link href={`/${locale}/services/${service.slug}`} />}
                      className="justify-start p-0 h-auto font-medium text-primary hover:text-primary/80"
                    >
                      {dict.services.viewService} →
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
        <div className="text-center">
          <Button
            variant="outline"
            render={<Link href={`/${locale}/services`} />}
          >
            {dict.home.featuredServices.viewAll} →
          </Button>
        </div>
      </div>
    </section>
  );
}
