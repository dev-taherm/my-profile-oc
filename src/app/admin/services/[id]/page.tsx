"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminServiceEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [id, setId] = useState<string>("");
  const [isNew, setIsNew] = useState(false);
  const [slug, setSlug] = useState("");
  const [icon, setIcon] = useState("");
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState("DRAFT");
  const [order, setOrder] = useState(0);
  const [enTitle, setEnTitle] = useState("");
  const [enShortDesc, setEnShortDesc] = useState("");
  const [enDescription, setEnDescription] = useState("");
  const [enFeatures, setEnFeatures] = useState("");
  const [arTitle, setArTitle] = useState("");
  const [arShortDesc, setArShortDesc] = useState("");
  const [arDescription, setArDescription] = useState("");
  const [arFeatures, setArFeatures] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    params.then(({ id: serviceId }) => {
      setId(serviceId);
      if (serviceId === "new") {
        setIsNew(true);
        return;
      }
      fetch(`/api/services`)
        .then((r) => r.json())
        .then((services) => {
          const s = services.find((sv: { id: string }) => sv.id === serviceId);
          if (s) {
            setSlug(s.slug);
            setIcon(s.icon || "");
            setFeatured(s.featured);
            setStatus(s.status);
            setOrder(s.order);
            const en = s.translations?.find((t: { locale: string }) => t.locale === "en");
            const ar = s.translations?.find((t: { locale: string }) => t.locale === "ar");
            if (en) {
              setEnTitle(en.title);
              setEnShortDesc(en.shortDesc);
              setEnDescription(en.description);
              setEnFeatures(en.features || "");
            }
            if (ar) {
              setArTitle(ar.title);
              setArShortDesc(ar.shortDesc);
              setArDescription(ar.description);
              setArFeatures(ar.features || "");
            }
          }
        });
    });
  }, [params]);

  const handleSave = async () => {
    setError("");
    setSaving(true);

    const data = {
      slug,
      icon: icon || null,
      featured,
      status,
      order,
      translations: [
        { locale: "en", title: enTitle, shortDesc: enShortDesc, description: enDescription, features: enFeatures || null },
        { locale: "ar", title: arTitle || enTitle, shortDesc: arShortDesc || enShortDesc, description: arDescription || enDescription, features: arFeatures || enFeatures || null },
      ],
    };

    const url = isNew ? "/api/services" : `/api/services?id=${id}`;
    const method = isNew ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error || "Failed to save");
        setSaving(false);
        return;
      }

      router.push("/admin/services");
    } catch {
      setError("Network error. Please try again.");
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">{isNew ? "New Service" : "Edit Service"}</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-sm">Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Slug (e.g. backend-development)" value={slug} onChange={(e) => setSlug(e.target.value)} />
          <Input placeholder="Lucide icon name (e.g. Code, Brain, Cloud)" value={icon} onChange={(e) => setIcon(e.target.value)} />
          <Input
            type="number"
            placeholder="Order (lower = first)"
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
          />
          <div className="flex gap-4 items-center">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
              Featured
            </label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="border rounded-md px-3 py-1.5 text-sm">
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="en" className="mb-6">
        <TabsList>
          <TabsTrigger value="en">English</TabsTrigger>
          <TabsTrigger value="ar">العربية</TabsTrigger>
        </TabsList>
        <TabsContent value="en" className="space-y-4 mt-4">
          <Input placeholder="Title (English)" value={enTitle} onChange={(e) => setEnTitle(e.target.value)} />
          <Textarea placeholder="Short description (for listing card)" value={enShortDesc} onChange={(e) => setEnShortDesc(e.target.value)} />
          <Textarea placeholder="Full description (Markdown)" rows={10} value={enDescription} onChange={(e) => setEnDescription(e.target.value)} />
          <Textarea placeholder="Features (one per line)" rows={5} value={enFeatures} onChange={(e) => setEnFeatures(e.target.value)} />
        </TabsContent>
        <TabsContent value="ar" className="space-y-4 mt-4">
          <Input placeholder="العنوان (عربي)" dir="rtl" value={arTitle} onChange={(e) => setArTitle(e.target.value)} />
          <Textarea placeholder="الوصف المختصر (عربي)" dir="rtl" value={arShortDesc} onChange={(e) => setArShortDesc(e.target.value)} />
          <Textarea placeholder="الوصف الكامل (ماركداون، عربي)" dir="rtl" rows={10} value={arDescription} onChange={(e) => setArDescription(e.target.value)} />
          <Textarea placeholder="الميزات (سطر واحد لكل ميزة)" dir="rtl" rows={5} value={arFeatures} onChange={(e) => setArFeatures(e.target.value)} />
        </TabsContent>
      </Tabs>

      <div className="flex gap-3 items-center">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
        <Button variant="outline" onClick={() => router.push("/admin/services")}>Cancel</Button>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
}
