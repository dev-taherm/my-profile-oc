"use client";

import { motion } from "framer-motion";
interface FeaturedTechProps {
  dict: {
    featuredTech: {
      title: string;
    };
  };
}

const technologies = [
  { name: "Python", color: "#3776AB" },
  { name: "Django", color: "#092E20" },
  { name: "FastAPI", color: "#009688" },
  { name: "PostgreSQL", color: "#4169E1" },
  { name: "Docker", color: "#2496ED" },
  { name: "AWS", color: "#FF9900" },
  { name: "React", color: "#61DAFB" },
  { name: "Next.js", color: "#000000" },
  { name: "LangChain", color: "#1C3C3C" },
  { name: "TypeScript", color: "#3178C6" },
  { name: "Tailwind", color: "#06B6D4" },
  { name: "Git", color: "#F05032" },
];

export function FeaturedTech({ dict }: FeaturedTechProps) {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-10">
          {dict.featuredTech.title}
        </h2>
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
