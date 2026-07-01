"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Save, User, Mail, Phone, MapPin, Globe, Share2, LayoutTemplate, FileText, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

interface ProfileData {
  name: string;
  title: string;
  description: string;
  url: string;
  email: string;
  phone: string;
  whatsapp: string;
  location: string;
  github: string;
  linkedin: string;
  instagram: string;
  facebook: string;
  twitterHandle: string;
  heroGreeting: string;
  heroSubtitle: string;
  heroDescription: string;
  aboutSummary: string;
  aboutMission: string;
  resumeSummary: string;
  statsExperience: string;
  statsProjects: string;
  statsTech: string;
  statsCerts: string;
}

export default function AdminProfilePage() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState<ProfileData>({
    name: "", title: "", description: "", url: "", email: "",
    phone: "", whatsapp: "", location: "",
    github: "", linkedin: "", instagram: "", facebook: "", twitterHandle: "",
    heroGreeting: "", heroSubtitle: "", heroDescription: "",
    aboutSummary: "", aboutMission: "", resumeSummary: "",
    statsExperience: "", statsProjects: "", statsTech: "", statsCerts: "",
  });

  useEffect(() => {
    fetch("/api/site-profile")
      .then((r) => r.json())
      .then((data) => {
        setForm({
          name: data.name || "",
          title: data.title || "",
          description: data.description || "",
          url: data.url || "",
          email: data.email || "",
          phone: data.phone || "",
          whatsapp: data.whatsapp || "",
          location: data.location || "",
          github: data.github || "",
          linkedin: data.linkedin || "",
          instagram: data.instagram || "",
          facebook: data.facebook || "",
          twitterHandle: data.twitterHandle || "",
          heroGreeting: data.heroGreeting || "",
          heroSubtitle: data.heroSubtitle || "",
          heroDescription: data.heroDescription || "",
          aboutSummary: data.aboutSummary || "",
          aboutMission: data.aboutMission || "",
          resumeSummary: data.resumeSummary || "",
          statsExperience: data.statsExperience || "",
          statsProjects: data.statsProjects || "",
          statsTech: data.statsTech || "",
          statsCerts: data.statsCerts || "",
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const update = (field: keyof ProfileData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSuccess("");
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/site-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error || "Failed to save");
        return;
      }

      setSuccess("Profile saved successfully!");
    } catch {
      setError("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="max-w-3xl space-y-6"><p className="text-muted-foreground">Loading profile...</p></div>;
  }

  const profileNavItems = [
    { label: "Main", href: "/admin/profile" },
    { label: "Experience", href: "/admin/profile/experience" },
    { label: "Education", href: "/admin/profile/education" },
    { label: "Skills", href: "/admin/profile/skills" },
    { label: "Certifications", href: "/admin/profile/certifications" },
    { label: "Languages", href: "/admin/profile/languages" },
  ];

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Site Profile</h1>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="me-2 h-4 w-4" />
          {saving ? "Saving..." : "Save Profile"}
        </Button>
      </div>

      <nav className="flex gap-1 border-b overflow-x-auto">
        {profileNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors -mb-px",
              pathname === item.href
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && <p className="text-sm text-green-500">{success}</p>}

      <Accordion defaultValue={["identity", "contact", "social", "hero", "about", "stats"]}>
        <AccordionItem value="identity">
          <AccordionTrigger className="text-base font-semibold">
            <span className="flex items-center gap-2"><User className="h-4 w-4" /> Identity</span>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Your name" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Job Title</label>
                <Input value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="Software Engineer" required />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description (Bio)</label>
              <Textarea value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Short bio for SEO and meta tags" rows={3} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2"><Globe className="h-4 w-4" /> Website URL</label>
              <Input value={form.url} onChange={(e) => update("url", e.target.value)} placeholder="https://yoursite.com" required />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="contact">
          <AccordionTrigger className="text-base font-semibold">
            <span className="flex items-center gap-2"><Phone className="h-4 w-4" /> Contact</span>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2"><Mail className="h-4 w-4" /> Email</label>
                <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@email.com" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2"><Phone className="h-4 w-4" /> Phone</label>
                <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+1234567890" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">WhatsApp</label>
                <Input value={form.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} placeholder="+1234567890" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2"><MapPin className="h-4 w-4" /> Location</label>
                <Input value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="City, Country" />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="social">
          <AccordionTrigger className="text-base font-semibold">
            <span className="flex items-center gap-2"><Share2 className="h-4 w-4" /> Social Links</span>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">GitHub URL</label>
              <Input value={form.github} onChange={(e) => update("github", e.target.value)} placeholder="https://github.com/username" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">LinkedIn URL</label>
              <Input value={form.linkedin} onChange={(e) => update("linkedin", e.target.value)} placeholder="https://linkedin.com/in/username" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Instagram URL</label>
                <Input value={form.instagram} onChange={(e) => update("instagram", e.target.value)} placeholder="https://instagram.com/username" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Facebook URL</label>
                <Input value={form.facebook} onChange={(e) => update("facebook", e.target.value)} placeholder="https://facebook.com/username" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Twitter Handle</label>
              <Input value={form.twitterHandle} onChange={(e) => update("twitterHandle", e.target.value)} placeholder="@username" />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="hero">
          <AccordionTrigger className="text-base font-semibold">
            <span className="flex items-center gap-2"><LayoutTemplate className="h-4 w-4" /> Hero Section</span>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Greeting Text</label>
              <Input value={form.heroGreeting} onChange={(e) => update("heroGreeting", e.target.value)} placeholder="Hello, I'm" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Subtitle / Tagline</label>
              <Textarea value={form.heroSubtitle} onChange={(e) => update("heroSubtitle", e.target.value)} placeholder="Building scalable architectures..." rows={2} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea value={form.heroDescription} onChange={(e) => update("heroDescription", e.target.value)} placeholder="Longer bio paragraph..." rows={4} />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="about">
          <AccordionTrigger className="text-base font-semibold">
            <span className="flex items-center gap-2"><FileText className="h-4 w-4" /> About & Resume</span>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">About Summary</label>
              <Textarea value={form.aboutSummary} onChange={(e) => update("aboutSummary", e.target.value)} placeholder="Professional summary for the About page..." rows={4} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Mission Statement</label>
              <Textarea value={form.aboutMission} onChange={(e) => update("aboutMission", e.target.value)} placeholder="Your professional mission..." rows={3} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Resume Summary</label>
              <Textarea value={form.resumeSummary} onChange={(e) => update("resumeSummary", e.target.value)} placeholder="Summary for the Resume page..." rows={3} />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="stats">
          <AccordionTrigger className="text-base font-semibold">
            <span className="flex items-center gap-2"><BarChart3 className="h-4 w-4" /> Stats (Homepage)</span>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Experience</label>
                <Input value={form.statsExperience} onChange={(e) => update("statsExperience", e.target.value)} placeholder="3+" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Projects</label>
                <Input value={form.statsProjects} onChange={(e) => update("statsProjects", e.target.value)} placeholder="10+" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Technologies</label>
                <Input value={form.statsTech} onChange={(e) => update("statsTech", e.target.value)} placeholder="15+" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Certifications</label>
                <Input value={form.statsCerts} onChange={(e) => update("statsCerts", e.target.value)} placeholder="3+" />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
