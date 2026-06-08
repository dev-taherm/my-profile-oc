"use client";

import { motion } from "framer-motion";
import { Briefcase, FolderOpen, Code, Award } from "lucide-react";
interface StatsProps {
  dict: {
    stats: {
      experience: string;
      projects: string;
      technologies: string;
      certifications: string;
    };
  };
}

const stats = [
  { key: "experience", value: "3+", icon: Briefcase },
  { key: "projects", value: "10+", icon: FolderOpen },
  { key: "technologies", value: "15+", icon: Code },
  { key: "certifications", value: "3+", icon: Award },
];

export function Stats({ dict }: StatsProps) {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center p-6 rounded-xl bg-card border shadow-sm"
            >
              <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">
                {dict.stats[stat.key as keyof typeof dict.stats]}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
