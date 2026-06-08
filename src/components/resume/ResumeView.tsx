"use client";


import { Download, Briefcase, GraduationCap, Award, Languages, Code, Brain, Cloud, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
interface ResumeViewProps {
  dict: {
    resume: {
      downloadPdf: string;
      summary: string;
      skills: string;
      experience: string;
      education: string;
      certifications: string;
      languages: string;
    };
    experience: {
      neoPlatrix: { company: string; role: string; period: string; highlights: string[] };
      pixova: { company: string; role: string; period: string; highlights: string[] };
      khebrat: { company: string; role: string; period: string; highlights: string[] };
    };
  };
}

const skillCategories = [
  {
    title: "Backend & Systems",
    icon: Code,
    skills: ["Python", "Django", "DRF", "FastAPI", "Microservices", "System Design", "DDD", "Multi-tenancy", "RBAC", "REST API"],
  },
  {
    title: "AI & LLM Engineering",
    icon: Brain,
    skills: ["LangChain", "RAG Pipelines", "Chroma", "FAISS", "OpenAI", "Prompt Engineering", "Guardrails"],
  },
  {
    title: "Cloud & DevOps",
    icon: Cloud,
    skills: ["AWS", "Docker", "CI/CD", "Celery", "Rate Limiting", "Observability"],
  },
  {
    title: "Frontend & Data",
    icon: Palette,
    skills: ["PostgreSQL", "MySQL", "Firebase", "React", "Next.js", "HTML5", "CSS3", "Tailwind"],
  },
];

export function ResumeView({ dict }: ResumeViewProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-end">
        <Button>
          <Download className="me-2 h-4 w-4" />
          {dict.resume.downloadPdf}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{dict.resume.summary}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            Software Engineer specializing in backend and AI systems, with experience designing
            scalable, microservices-oriented architectures and integrating LLMs into production
            workflows. Strong background in Django-based platforms, multi-tenant systems, and
            audit-safe business processes. Experienced with Agile delivery, cloud-native concepts,
            and building systems that serve real users with measurable impact.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Code className="h-5 w-5 text-primary" />
            {dict.resume.skills}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            {skillCategories.map((cat) => (
              <div key={cat.title}>
                <div className="flex items-center gap-2 mb-2">
                  <cat.icon className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm">{cat.title}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {cat.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            {dict.resume.experience}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {[dict.experience.neoPlatrix, dict.experience.pixova, dict.experience.khebrat].map(
            (exp, index) => (
              <div key={index}>
                {index > 0 && <Separator className="mb-6" />}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                  <h3 className="font-bold">{exp.role}</h3>
                  <Badge variant="outline">{exp.period}</Badge>
                </div>
                <p className="text-primary text-sm mb-2">{exp.company}</p>
                <ul className="space-y-1">
                  {exp.highlights.map((h, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex gap-2">
                      <span className="text-primary mt-0.5 shrink-0">•</span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            {dict.resume.education}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="font-bold">B.Sc. in Computer Science (Software Development), with Honors</h3>
          <p className="text-primary text-sm">Universiti Teknikal Malaysia Melaka (UTeM)</p>
          <p className="text-sm text-muted-foreground">Malaysia · 2018–2022</p>
        </CardContent>
      </Card>

      <div className="grid sm:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              {dict.resume.certifications}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">LLM & AI Systems (Self-study: LangChain, RAG Pipelines)</p>
            <p className="text-sm">Udemy: LLM Engineering & LangChain Courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Languages className="h-5 w-5 text-primary" />
              {dict.resume.languages}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Arabic</span>
              <Badge variant="outline">Native</Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span>English</span>
              <Badge variant="outline">Professional</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
