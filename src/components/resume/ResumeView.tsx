"use client";

import { useEffect, useState } from "react";
import { Download, Briefcase, GraduationCap, Award, Languages, Code, Brain, Cloud, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { type SiteProfileData } from "@/lib/profile";

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
  profile: SiteProfileData;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code,
  Brain,
  Cloud,
  Palette,
};

export function ResumeView({ dict, profile }: ResumeViewProps) {
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/resume")
      .then((r) => r.json())
      .then((data) => {
        if (data?.resumeUrl) setResumeUrl(data.resumeUrl);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {resumeUrl && (
        <div className="flex justify-end">
          <Button render={<a href={resumeUrl} download />}>
            <Download className="me-2 h-4 w-4" />
            {dict.resume.downloadPdf}
          </Button>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{dict.resume.summary}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            {profile.resumeSummary || profile.description}
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
            {profile.skillCategories.map((cat) => {
              const IconComponent = iconMap[cat.icon || "Code"] || Code;
              return (
                <div key={cat.id}>
                  <div className="flex items-center gap-2 mb-2">
                    <IconComponent className="h-4 w-4 text-primary" />
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
              );
            })}
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
          {profile.experiences.map((exp, index) => (
            <div key={exp.id}>
              {index > 0 && <Separator className="mb-6" />}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                <h2 className="font-bold text-lg">{exp.role}</h2>
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
          ))}
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
          {profile.educations.map((edu) => (
            <div key={edu.id}>
              <h2 className="font-bold text-lg">{edu.degree}</h2>
              <p className="text-primary text-sm">{edu.institution}</p>
              <p className="text-sm text-muted-foreground">{edu.location ? `${edu.location} · ` : ""}{edu.period}</p>
            </div>
          ))}
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
            {profile.certifications.map((cert) => (
              <p key={cert.id} className="text-sm">{cert.title}</p>
            ))}
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
            {profile.languages.map((lang) => (
              <div key={lang.id} className="flex justify-between text-sm">
                <span>{lang.name}</span>
                <Badge variant="outline">{lang.level}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
