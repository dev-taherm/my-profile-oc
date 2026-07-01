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

interface Certification {
  id: string;
  title: string;
  issuer: string | null;
  year: string | null;
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
  certifications: Certification[];
  languages: { id: string; name: string; level: string; order: number }[];
}

const emptyForm = { title: "", issuer: "", year: "" };

export default function AdminCertificationsPage() {
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

  const handleEdit = (cert: Certification) => {
    setEditingId(cert.id);
    setForm({ title: cert.title, issuer: cert.issuer || "", year: cert.year || "" });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSaveItem = () => {
    if (!profile) return;
    const maxOrder = Math.max(0, ...profile.certifications.map((c) => c.order));

    let updated: Certification[];
    if (editingId) {
      updated = profile.certifications.map((c) =>
        c.id === editingId ? { ...c, title: form.title, issuer: form.issuer || null, year: form.year || null } : c
      );
    } else {
      updated = [...profile.certifications, { id: `cert-${Date.now()}`, title: form.title, issuer: form.issuer || null, year: form.year || null, order: maxOrder + 1 }];
    }
    setProfile({ ...profile, certifications: updated });
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleDelete = (id: string) => {
    if (!profile || !window.confirm("Delete this certification?")) return;
    setProfile({ ...profile, certifications: profile.certifications.filter((c) => c.id !== id) });
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
      setSuccess("Certifications saved successfully!");
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
              {editingId ? "Edit Certification" : "Add Certification"}
              <Button variant="ghost" size="icon" onClick={handleCancel}><X className="h-4 w-4" /></Button>
            </CardTitle>
          </CardHeader>
          <div className="px-4 pb-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Certification title" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Issuer</label>
                <Input value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} placeholder="Udemy, AWS, etc." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Year</label>
                <Input value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} placeholder="2024" />
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
          <Plus className="me-2 h-4 w-4" /> Add Certification
        </Button>
      )}

      <div className="space-y-3">
        {profile.certifications.length === 0 && <p className="text-muted-foreground">No certifications yet.</p>}
        {profile.certifications.map((cert) => (
          <Card key={cert.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div>
                  <span className="font-medium">{cert.title}</span>
                  {cert.issuer && <span className="text-muted-foreground ml-2">— {cert.issuer}</span>}
                  {cert.year && <span className="text-sm text-muted-foreground ml-2">{cert.year}</span>}
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(cert)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(cert.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
