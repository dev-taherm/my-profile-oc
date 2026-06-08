"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminProjectEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [id, setId] = useState<string>("");
  const [isNew, setIsNew] = useState(false);
  const [slug, setSlug] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState("DRAFT");
  const [enTitle, setEnTitle] = useState("");
  const [enDescription, setEnDescription] = useState("");
  const [enContent, setEnContent] = useState("");
  const [arTitle, setArTitle] = useState("");
  const [arDescription, setArDescription] = useState("");
  const [arContent, setArContent] = useState("");
  const router = useRouter();

  useEffect(() => {
    params.then(({ id: projectId }) => {
      setId(projectId);
      if (projectId === "new") {
        setIsNew(true);
        return;
      }
      fetch(`/api/projects`)
        .then((r) => r.json())
        .then((projects) => {
          const p = projects.find((pr: { id: string }) => pr.id === projectId);
          if (p) {
            setSlug(p.slug);
            setGithubUrl(p.githubUrl || "");
            setLiveUrl(p.liveUrl || "");
            setFeatured(p.featured);
            setStatus(p.status);
            const en = p.translations?.find((t: { locale: string }) => t.locale === "en");
            const ar = p.translations?.find((t: { locale: string }) => t.locale === "ar");
            if (en) { setEnTitle(en.title); setEnDescription(en.description); setEnContent(en.content || ""); }
            if (ar) { setArTitle(ar.title); setArDescription(ar.description); setArContent(ar.content || ""); }
          }
        });
    });
  }, [params]);

  const handleSave = async () => {
    const data = {
      slug,
      githubUrl: githubUrl || null,
      liveUrl: liveUrl || null,
      featured,
      status,
      translations: [
        { locale: "en", title: enTitle, description: enDescription, content: enContent },
        { locale: "ar", title: arTitle || enTitle, description: arDescription || enDescription, content: arContent || enContent },
      ],
    };

    const url = isNew ? "/api/projects" : `/api/projects?id=${id}`;
    const method = isNew ? "POST" : "PUT";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    router.push("/admin/projects");
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">{isNew ? "New Project" : "Edit Project"}</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-sm">Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Slug (e.g. my-project)" value={slug} onChange={(e) => setSlug(e.target.value)} />
          <Input placeholder="GitHub URL" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} />
          <Input placeholder="Live URL" value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)} />
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
          <Textarea placeholder="Description (English)" value={enDescription} onChange={(e) => setEnDescription(e.target.value)} />
          <Textarea placeholder="Content (Markdown, English)" rows={10} value={enContent} onChange={(e) => setEnContent(e.target.value)} />
        </TabsContent>
        <TabsContent value="ar" className="space-y-4 mt-4">
          <Input placeholder="العنوان (عربي)" dir="rtl" value={arTitle} onChange={(e) => setArTitle(e.target.value)} />
          <Textarea placeholder="الوصف (عربي)" dir="rtl" value={arDescription} onChange={(e) => setArDescription(e.target.value)} />
          <Textarea placeholder="المحتوى (ماركداون، عربي)" dir="rtl" rows={10} value={arContent} onChange={(e) => setArContent(e.target.value)} />
        </TabsContent>
      </Tabs>

      <div className="flex gap-3">
        <Button onClick={handleSave}>Save</Button>
        <Button variant="outline" onClick={() => router.push("/admin/projects")}>Cancel</Button>
      </div>
    </div>
  );
}
