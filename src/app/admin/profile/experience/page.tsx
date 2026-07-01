"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, Trash2, Save, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const profileNavItems = [
  { label: "Main", href: "/admin/profile" },
  { label: "Experience", href: "/admin/profile/experience" },
  { label: "Education", href: "/admin/profile/education" },
  { label: "Skills", href: "/admin/profile/skills" },
  { label: "Certifications", href: "/admin/profile/certifications" },
  { label: "Languages", href: "/admin/profile/languages" },
];

interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  highlights: string[];
  order: number;
}

interface ProfileData {
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
  experiences: Experience[];
  educations: { id: string; degree: string; institution: string; location: string | null; period: string; order: number }[];
  skillCategories: { id: string; title: string; icon: string | null; skills: string[]; order: number }[];
  certifications: { id: string; title: string; issuer: string | null; year: string | null; order: number }[];
  languages: { id: string; name: string; level: string; order: number }[];
}

const emptyForm = { company: "", role: "", period: "", highlights: "" };

export default function AdminExperiencePage() {
  const pathname = usePathname();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetch("/api/site-profile")
      .then((r) => r.json())
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const handleEdit = (exp: Experience) => {
    setEditingId(exp.id);
    setForm({
      company: exp.company,
      role: exp.role,
      period: exp.period,
      highlights: exp.highlights.join("\n"),
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSaveItem = () => {
    if (!profile) return;
    const highlights = form.highlights.split("\n").filter((l) => l.trim());
    const maxOrder = Math.max(0, ...profile.experiences.map((e) => e.order));

    let updated: Experience[];
    if (editingId) {
      updated = profile.experiences.map((e) =>
        e.id === editingId ? { ...e, company: form.company, role: form.role, period: form.period, highlights } : e
      );
    } else {
      updated = [...profile.experiences, { id: `exp-${Date.now()}`, company: form.company, role: form.role, period: form.period, highlights, order: maxOrder + 1 }];
    }
    setProfile({ ...profile, experiences: updated });
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleDelete = (id: string) => {
    if (!profile || !window.confirm("Delete this experience entry?")) return;
    setProfile({ ...profile, experiences: profile.experiences.filter((e) => e.id !== id) });
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/site-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error || "Failed to save");
        return;
      }
      setSuccess("Experience saved successfully!");
    } catch {
      setError("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="max-w-3xl space-y-6"><p className="text-muted-foreground">Loading...</p></div>;
  if (!profile) return <div className="max-w-3xl space-y-6"><p className="text-red-500">Failed to load profile</p></div>;

  return (
    <div className="max-w-3xl space-y-6">
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

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          <Save className="me-2 h-4 w-4" />
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {editingId ? "Edit Experience" : "Add Experience"}
              <Button variant="ghost" size="icon" onClick={handleCancel}><X className="h-4 w-4" /></Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Company</label>
                <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Company name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Job title" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Period</label>
              <Input value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} placeholder="Jan 2024 – Present" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Highlights (one per line)</label>
              <Textarea value={form.highlights} onChange={(e) => setForm({ ...form, highlights: e.target.value })} placeholder="Built scalable APIs&#10;Led a team of 5" rows={4} />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSaveItem}>{editingId ? "Update" : "Add"}</Button>
              <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!showForm && (
        <Button variant="outline" onClick={handleAdd}>
          <Plus className="me-2 h-4 w-4" /> Add Experience
        </Button>
      )}

      <div className="space-y-3">
        {profile.experiences.length === 0 && <p className="text-muted-foreground">No experience entries yet.</p>}
        {profile.experiences.map((exp) => (
          <Card key={exp.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div>
                  <span className="font-medium">{exp.company}</span>
                  <span className="text-muted-foreground ml-2">— {exp.role}</span>
                  <span className="text-sm text-muted-foreground ml-2">{exp.period}</span>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(exp)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(exp.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </CardTitle>
            </CardHeader>
            {exp.highlights.length > 0 && (
              <CardContent>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  {exp.highlights.map((h, i) => <li key={i}>{h}</li>)}
                </ul>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
