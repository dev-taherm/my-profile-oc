"use client";

import { motion } from "framer-motion";
import { type SiteProfileData } from "@/lib/profile";

interface FeaturedTechProps {
  dict: {
    featuredTech: {
      title: string;
      subtitle: string;
    };
  };
  profile: SiteProfileData;
}

const techColors: Record<string, string> = {
  Python: "#3776AB",
  Django: "#092E20",
  FastAPI: "#009688",
  PostgreSQL: "#4169E1",
  Docker: "#2496ED",
  AWS: "#FF9900",
  React: "#61DAFB",
  "Next.js": "#000000",
  LangChain: "#1C3C3C",
  TypeScript: "#3178C6",
  Tailwind: "#06B6D4",
  Git: "#F05032",
};

export function FeaturedTech({ dict, profile }: FeaturedTechProps) {
  const technologies = profile.skillCategories.flatMap((cat) =>
    cat.skills.map((skill) => ({
      name: skill,
      color: techColors[skill] || "#666666",
    }))
  );
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-3">
          {dict.featuredTech.title}
        </h2>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-10">
          {dict.featuredTech.subtitle}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="tech-pill px-5 py-2.5 rounded-full border bg-card text-sm font-medium shadow-sm hover:shadow-md transition-shadow"
              style={
                {
                  "--tech-border": `${tech.color}30`,
                  "--tech-dot": tech.color,
                } as React.CSSProperties
              }
            >
              <span className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full bg-[var(--tech-dot)]"
                />
                {tech.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
