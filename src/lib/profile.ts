import { prisma } from "@/lib/prisma";

export interface SiteProfileData {
  name: string;
  title: string;
  description: string;
  url: string;
  email: string;
  phone: string | null;
  whatsapp: string | null;
  location: string | null;
  github: string | null;
  linkedin: string | null;
  instagram: string | null;
  facebook: string | null;
  twitterHandle: string | null;
  heroGreeting: string | null;
  heroSubtitle: string | null;
  heroDescription: string | null;
  aboutSummary: string | null;
  aboutMission: string | null;
  resumeSummary: string | null;
  statsExperience: string | null;
  statsProjects: string | null;
  statsTech: string | null;
  statsCerts: string | null;
  experiences: {
    id: string;
    company: string;
    role: string;
    period: string;
    highlights: string[];
    order: number;
  }[];
  educations: {
    id: string;
    degree: string;
    institution: string;
    location: string | null;
    period: string;
    order: number;
  }[];
  skillCategories: {
    id: string;
    title: string;
    icon: string | null;
    skills: string[];
    order: number;
  }[];
  certifications: {
    id: string;
    title: string;
    issuer: string | null;
    year: string | null;
    order: number;
  }[];
  languages: {
    id: string;
    name: string;
    level: string;
    order: number;
  }[];
}

const DEFAULT_PROFILE: SiteProfileData = {
  name: "Taher Mahram",
  title: "Software Engineer",
  description:
    "Software Engineer specializing in backend and AI systems, with experience designing scalable, microservices-oriented architectures and integrating LLMs into production workflows.",
  url: "https://taher.pixovagency.com",
  email: "tahermahram0@gmail.com",
  phone: "+967 779991263",
  whatsapp: "+967733918465",
  location: "Sana'a, Yemen",
  github: "https://github.com/dev-taherm",
  linkedin: "https://www.linkedin.com/in/taher-mahram/",
  instagram: "https://instagram.com/dev_taher",
  facebook: "https://www.facebook.com/taher.ali.moharam",
  twitterHandle: "@dev_taher",
  heroGreeting: "Hello, I'm",
  heroSubtitle: "Building scalable architectures and integrating LLMs into production workflows.",
  heroDescription:
    "I design and build robust backend systems, AI-powered applications, and cloud-native architectures. With over 3 years of experience in Python, Django, and LLM engineering, I help businesses transform ideas into production-ready software that scales.",
  aboutSummary:
    "Software Engineer specializing in backend and AI systems, with experience designing scalable, microservices-oriented architectures and integrating LLMs into production workflows. Strong background in Django-based platforms, multi-tenant systems, and audit-safe business processes. Experienced with Agile delivery, cloud-native concepts, and building systems that serve real users with measurable impact.",
  aboutMission:
    "My mission is to leverage technology to solve real-world problems, building systems that are not only technically sound but also deliver measurable business value.",
  resumeSummary:
    "Software Engineer specializing in backend and AI systems, with experience designing scalable, microservices-oriented architectures and integrating LLMs into production workflows. Strong background in Django-based platforms, multi-tenant systems, and audit-safe business processes. Experienced with Agile delivery, cloud-native concepts, and building systems that serve real users with measurable impact.",
  statsExperience: "3+",
  statsProjects: "10+",
  statsTech: "15+",
  statsCerts: "3+",
  experiences: [
    {
      id: "default-exp-1",
      company: "Neo Platrix (Hopofy)",
      role: "Software Engineer",
      period: "Jan 2024 – Present",
      highlights: [
        "Led the design of the core product backend, building scalable REST APIs (Django/PostgreSQL) that serve 100+ active users with backward-compatible versioning.",
        "Modeled complex business workflows with strict audit trails and Role-Based Access Control (RBAC), reducing manual processing time by 40%.",
        "Implemented Django Channels and WebSockets to handle thousands of monthly events and real-time notifications.",
        "Championed AI-assisted pipelines, including prompt templates, validation guardrails for AI-generated code, and automated suggestion features.",
        "Introduced structured logging, rate limiting, and standard error-handling patterns to improve system observability and stability under load.",
      ],
      order: 1,
    },
    {
      id: "default-exp-2",
      company: "Pixova Agency",
      role: "Founder & Software Engineer",
      period: "Nov 2022 – Dec 2023",
      highlights: [
        "Led end-to-end architecture and delivery for client-facing web products, managing the lifecycle from UI/UX mockups to deployment.",
        "Delivered custom WordPress solutions and full-stack web applications, owning hosting configurations and SEO optimizations.",
        "Implemented developer-friendly Git workflows, testing protocols, and CI practices to reduce delivery friction and improve code quality.",
      ],
      order: 2,
    },
    {
      id: "default-exp-3",
      company: "Khebrat Technology",
      role: "Web Application Developer Intern",
      period: "Mar 2022 – Aug 2022",
      highlights: [
        "Built workflow management applications to automate internal processes, utilizing Node.js and Firebase for the backend.",
        "Developed responsive frontends using HTML, CSS, and Bootstrap, ensuring cross-device compatibility.",
      ],
      order: 3,
    },
  ],
  educations: [
    {
      id: "default-edu-1",
      degree: "B.Sc. in Computer Science (Software Development), with Honors",
      institution: "Universiti Teknikal Malaysia Melaka (UTeM)",
      location: "Malaysia",
      period: "2018–2022",
      order: 1,
    },
  ],
  skillCategories: [
    {
      id: "default-skill-1",
      title: "Backend & Systems",
      icon: "Code",
      skills: ["Python", "Django", "DRF", "FastAPI", "Microservices", "System Design", "DDD", "Multi-tenancy", "RBAC", "REST API"],
      order: 1,
    },
    {
      id: "default-skill-2",
      title: "AI & LLM Engineering",
      icon: "Brain",
      skills: ["LangChain", "RAG Pipelines", "Chroma", "FAISS", "OpenAI", "Prompt Engineering", "Guardrails"],
      order: 2,
    },
    {
      id: "default-skill-3",
      title: "Cloud & DevOps",
      icon: "Cloud",
      skills: ["AWS", "Docker", "CI/CD", "Celery", "Rate Limiting", "Observability"],
      order: 3,
    },
    {
      id: "default-skill-4",
      title: "Frontend & Data",
      icon: "Palette",
      skills: ["PostgreSQL", "MySQL", "Firebase", "React", "Next.js", "HTML5", "CSS3", "Tailwind"],
      order: 4,
    },
  ],
  certifications: [
    { id: "default-cert-1", title: "LLM & AI Systems (Self-study: LangChain, RAG Pipelines)", issuer: null, year: null, order: 1 },
    { id: "default-cert-2", title: "Udemy: LLM Engineering & LangChain Courses", issuer: "Udemy", year: null, order: 2 },
  ],
  languages: [
    { id: "default-lang-1", name: "Arabic", level: "Native", order: 1 },
    { id: "default-lang-2", name: "English", level: "Professional", order: 2 },
  ],
};

let cachedProfile: SiteProfileData | null = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 60_000; // 1 minute

export function invalidateProfileCache() {
  cachedProfile = null;
  cacheTimestamp = 0;
}

export async function getSiteProfile(): Promise<SiteProfileData> {
  const now = Date.now();
  if (cachedProfile && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedProfile;
  }

  try {
    const profile = await prisma.siteProfile.findUnique({
      where: { id: "default" },
      include: {
        experiences: { orderBy: { order: "asc" } },
        educations: { orderBy: { order: "asc" } },
        skillCategories: { orderBy: { order: "asc" } },
        certifications: { orderBy: { order: "asc" } },
        languages: { orderBy: { order: "asc" } },
      },
    });

    if (!profile) {
      return DEFAULT_PROFILE;
    }

    const result: SiteProfileData = {
      name: profile.name,
      title: profile.title,
      description: profile.description,
      url: profile.url,
      email: profile.email,
      phone: profile.phone,
      whatsapp: profile.whatsapp,
      location: profile.location,
      github: profile.github,
      linkedin: profile.linkedin,
      instagram: profile.instagram,
      facebook: profile.facebook,
      twitterHandle: profile.twitterHandle,
      heroGreeting: profile.heroGreeting,
      heroSubtitle: profile.heroSubtitle,
      heroDescription: profile.heroDescription,
      aboutSummary: profile.aboutSummary,
      aboutMission: profile.aboutMission,
      resumeSummary: profile.resumeSummary,
      statsExperience: profile.statsExperience,
      statsProjects: profile.statsProjects,
      statsTech: profile.statsTech,
      statsCerts: profile.statsCerts,
      experiences: profile.experiences.map((e) => ({
        id: e.id,
        company: e.company,
        role: e.role,
        period: e.period,
        highlights: safeJsonParse(e.highlights, []),
        order: e.order,
      })),
      educations: profile.educations.map((e) => ({
        id: e.id,
        degree: e.degree,
        institution: e.institution,
        location: e.location,
        period: e.period,
        order: e.order,
      })),
      skillCategories: profile.skillCategories.map((sc) => ({
        id: sc.id,
        title: sc.title,
        icon: sc.icon,
        skills: safeJsonParse(sc.skills, []),
        order: sc.order,
      })),
      certifications: profile.certifications.map((c) => ({
        id: c.id,
        title: c.title,
        issuer: c.issuer,
        year: c.year,
        order: c.order,
      })),
      languages: profile.languages.map((l) => ({
        id: l.id,
        name: l.name,
        level: l.level,
        order: l.order,
      })),
    };

    cachedProfile = result;
    cacheTimestamp = now;
    return result;
  } catch {
    return DEFAULT_PROFILE;
  }
}

function safeJsonParse<T>(value: string, fallback: T): T {
  try {
    const parsed: unknown = JSON.parse(value);
    return (Array.isArray(parsed) ? parsed : fallback) as T;
  } catch {
    return fallback;
  }
}
