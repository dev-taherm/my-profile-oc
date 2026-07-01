"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, Trash2, Save, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const profileNavItems = [
  { label: "Main", href: "/admin/profile" },
  { label: "Experience", href: "/admin/profile/experience" },
  { label: "Education", href: "/admin/profile/education" },
  { label: "Skills", href: "/admin/profile/skills" },
  { label: "Certifications", href: "/admin/profile/certifications" },
  { label: "Languages", href: "/admin/profile/languages" },
];

interface Language {
  id: string;
  name: string;
  level: string;
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
  experiences: { id: string; company: string; role: string; period: string; highlights: string[]; order: number }[];
  educations: { id: string; degree: string; institution: string; location: string | null; period: string; order: number }[];
  skillCategories: { id: string; title: string; icon: string | null; skills: string[]; order: number }[];
  certifications: { id: string; title: string; issuer: string | null; year: string | null; order: number }[];
  languages: Language[];
}

const emptyForm = { name: "", level: "" };

export default function AdminLanguagesPage() {
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

  const handleEdit = (lang: Language) => {
    setEditingId(lang.id);
    setForm({ name: lang.name, level: lang.level });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSaveItem = () => {
    if (!profile) return;
    const maxOrder = Math.max(0, ...profile.languages.map((l) => l.order));

    let updated: Language[];
    if (editingId) {
      updated = profile.languages.map((l) =>
        l.id === editingId ? { ...l, name: form.name, level: form.level } : l
      );
    } else {
      updated = [...profile.languages, { id: `lang-${Date.now()}`, name: form.name, level: form.level, order: maxOrder + 1 }];
    }
    setProfile({ ...profile, languages: updated });
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleDelete = (id: string) => {
    if (!profile || !window.confirm("Delete this language?")) return;
    setProfile({ ...profile, languages: profile.languages.filter((l) => l.id !== id) });
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
      setSuccess("Languages saved successfully!");
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
              {editingId ? "Edit Language" : "Add Language"}
              <Button variant="ghost" size="icon" onClick={handleCancel}><X className="h-4 w-4" /></Button>
            </CardTitle>
          </CardHeader>
          <div className="px-4 pb-4 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Language</label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="English" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Level</label>
                <Input value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} placeholder="Native, Professional, etc." />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSaveItem}>{editingId ? "Update" : "Add"}</Button>
              <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            </div>
          </div>
        </Card>
      )}

      {!showForm && (
        <Button variant="outline" onClick={handleAdd}>
          <Plus className="me-2 h-4 w-4" /> Add Language
        </Button>
      )}

      <div className="space-y-3">
        {profile.languages.length === 0 && <p className="text-muted-foreground">No languages yet.</p>}
        {profile.languages.map((lang) => (
          <Card key={lang.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div>
                  <span className="font-medium">{lang.name}</span>
                  <span className="text-muted-foreground ml-2">— {lang.level}</span>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(lang)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(lang.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
