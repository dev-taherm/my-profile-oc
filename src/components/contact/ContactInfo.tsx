"use client";

import { Mail, MapPin, CheckCircle } from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon, FacebookIcon, WhatsappIcon } from "@/components/shared/Icons";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/lib/constants";

interface ContactInfoProps {
  dict: {
    contact: {
      info: {
        email: string;
        phone: string;
        location: string;
        availability: string;
      };
    };
  };
}

export function ContactInfo({ dict }: ContactInfoProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{dict.contact.info.email}</p>
              <a href={`mailto:${siteConfig.email}`} className="font-medium hover:text-primary transition-colors">
                {siteConfig.email}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <WhatsappIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{dict.contact.info.phone}</p>
              <a
                href={`https://wa.me/${siteConfig.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:text-primary transition-colors"
              >
                {siteConfig.whatsapp}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{dict.contact.info.location}</p>
              <p className="font-medium">{siteConfig.location}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <p className="font-medium">{dict.contact.info.availability}</p>
          </div>
          <div className="flex gap-3">
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg border hover:bg-muted transition-colors"
            >
              <GithubIcon className="h-5 w-5" />
            </a>
            <a
              href={siteConfig.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg border hover:bg-muted transition-colors"
            >
              <LinkedinIcon className="h-5 w-5" />
            </a>
            <a
              href={siteConfig.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg border hover:bg-muted transition-colors"
            >
              <InstagramIcon className="h-5 w-5" />
            </a>
            <a
              href={siteConfig.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg border hover:bg-muted transition-colors"
            >
              <FacebookIcon className="h-5 w-5" />
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              className="p-2 rounded-lg border hover:bg-muted transition-colors"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
