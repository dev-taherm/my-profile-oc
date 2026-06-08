"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminBlogEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [id, setId] = useState<string>("");
  const [isNew, setIsNew] = useState(false);
  const [slug, setSlug] = useState("");
  const [readingTime, setReadingTime] = useState(5);
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState("DRAFT");
  const [enTitle, setEnTitle] = useState("");
  const [enExcerpt, setEnExcerpt] = useState("");
  const [enContent, setEnContent] = useState("");
  const [arTitle, setArTitle] = useState("");
  const [arExcerpt, setArExcerpt] = useState("");
  const [arContent, setArContent] = useState("");
  const router = useRouter();

  useEffect(() => {
    params.then(({ id: blogId }) => {
      setId(blogId);
      if (blogId === "new") {
        setIsNew(true);
        return;
      }
      fetch("/api/blog")
        .then((r) => r.json())
        .then((posts) => {
          const p = posts.find((post: { id: string }) => post.id === blogId);
          if (p) {
            setSlug(p.slug);
            setReadingTime(p.readingTime);
            setFeatured(p.featured);
            setStatus(p.status);
            const en = p.translations?.find((t: { locale: string }) => t.locale === "en");
            const ar = p.translations?.find((t: { locale: string }) => t.locale === "ar");
            if (en) { setEnTitle(en.title); setEnExcerpt(en.excerpt); setEnContent(en.content); }
            if (ar) { setArTitle(ar.title); setArExcerpt(ar.excerpt); setArContent(ar.content); }
          }
        });
    });
  }, [params]);

  const handleSave = async () => {
    const data = {
      slug,
      readingTime,
      featured,
      status,
      publishedAt: status === "PUBLISHED" ? new Date().toISOString() : null,
      translations: [
        { locale: "en", title: enTitle, excerpt: enExcerpt, content: enContent },
        { locale: "ar", title: arTitle || enTitle, excerpt: arExcerpt || enExcerpt, content: arContent || enContent },
      ],
    };

    const url = isNew ? "/api/blog" : `/api/blog?id=${id}`;
    const method = isNew ? "POST" : "PUT";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    router.push("/admin/blog");
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">{isNew ? "New Blog Post" : "Edit Blog Post"}</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-sm">Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
          <div className="flex gap-4 items-center">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm">
              Reading time:
              <input type="number" value={readingTime} onChange={(e) => setReadingTime(Number(e.target.value))} className="w-16 border rounded px-2 py-1" />
              min
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
          <Textarea placeholder="Excerpt (English)" value={enExcerpt} onChange={(e) => setEnExcerpt(e.target.value)} />
          <Textarea placeholder="Content (Markdown, English)" rows={15} value={enContent} onChange={(e) => setEnContent(e.target.value)} />
        </TabsContent>
        <TabsContent value="ar" className="space-y-4 mt-4">
          <Input placeholder="العنوان (عربي)" dir="rtl" value={arTitle} onChange={(e) => setArTitle(e.target.value)} />
          <Textarea placeholder="المقتطف (عربي)" dir="rtl" value={arExcerpt} onChange={(e) => setArExcerpt(e.target.value)} />
          <Textarea placeholder="المحتوى (ماركداون، عربي)" dir="rtl" rows={15} value={arContent} onChange={(e) => setArContent(e.target.value)} />
        </TabsContent>
      </Tabs>

      <div className="flex gap-3">
        <Button onClick={handleSave}>Save</Button>
        <Button variant="outline" onClick={() => router.push("/admin/blog")}>Cancel</Button>
      </div>
    </div>
  );
}
