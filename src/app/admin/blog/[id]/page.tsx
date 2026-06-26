"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";
import { InlineTaxonomyCreator } from "@/components/admin/InlineTaxonomyCreator";
import { AiChatPanel } from "@/components/admin/AiChatPanel";

interface TaxonomyItem {
  id: string;
  name: string;
}

export default function AdminBlogEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [id, setId] = useState<string>("");
  const [isNew, setIsNew] = useState(false);
  const [slug, setSlug] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [readingTime, setReadingTime] = useState(5);
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState("DRAFT");
  const [enTitle, setEnTitle] = useState("");
  const [enExcerpt, setEnExcerpt] = useState("");
  const [enContent, setEnContent] = useState("");
  const [arTitle, setArTitle] = useState("");
  const [arExcerpt, setArExcerpt] = useState("");
  const [arContent, setArContent] = useState("");
  const [allCategories, setAllCategories] = useState<TaxonomyItem[]>([]);
  const [allTags, setAllTags] = useState<TaxonomyItem[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [aiActiveLocale, setAiActiveLocale] = useState<"en" | "ar">("en");

  useEffect(() => {
    fetch("/api/categories").then((r) => r.json()).then(setAllCategories);
    fetch("/api/tags").then((r) => r.json()).then(setAllTags);
  }, []);

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
            setCoverImage(p.coverImage || "");
            setReadingTime(p.readingTime);
            setFeatured(p.featured);
            setStatus(p.status);
            setSelectedCategoryIds(p.categories?.map((c: TaxonomyItem) => c.id) || []);
            setSelectedTagIds(p.tags?.map((t: TaxonomyItem) => t.id) || []);
            const en = p.translations?.find((t: { locale: string }) => t.locale === "en");
            const ar = p.translations?.find((t: { locale: string }) => t.locale === "ar");
            if (en) { setEnTitle(en.title); setEnExcerpt(en.excerpt); setEnContent(en.content); }
            if (ar) { setArTitle(ar.title); setArExcerpt(ar.excerpt); setArContent(ar.content); }
          }
        });
    });
  }, [params]);

  const toggleId = (ids: string[], setIds: (v: string[]) => void, targetId: string) => {
    setIds(ids.includes(targetId) ? ids.filter((i) => i !== targetId) : [...ids, targetId]);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload?type=blog", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error || "Upload failed");
        return;
      }

      const { url } = await res.json();
      setCoverImage(url);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    setError("");
    setSaving(true);

    const data = {
      slug,
      coverImage: coverImage || null,
      readingTime,
      featured,
      status,
      publishedAt: status === "PUBLISHED" ? new Date().toISOString() : null,
      categoryIds: selectedCategoryIds,
      tagIds: selectedTagIds,
      translations: [
        { locale: "en", title: enTitle, excerpt: enExcerpt, content: enContent },
        { locale: "ar", title: arTitle || enTitle, excerpt: arExcerpt || enExcerpt, content: arContent || enContent },
      ],
    };

    const url = isNew ? "/api/blog" : `/api/blog?id=${id}`;
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

      router.push("/admin/blog");
    } catch {
      setError("Network error. Please try again.");
      setSaving(false);
    }
  };

  const openAiPanel = (locale: "en" | "ar") => {
    setAiActiveLocale(locale);
    setAiPanelOpen(true);
  };

  const currentTitle = aiActiveLocale === "en" ? enTitle : arTitle || enTitle;
  const currentExcerpt = aiActiveLocale === "en" ? enExcerpt : arExcerpt || enExcerpt;
  const currentContent = aiActiveLocale === "en" ? enContent : arContent;

  const handleAiApplyFields = async (fields: import("@/lib/ai-providers").AiFieldUpdates, targetLocale: "en" | "ar") => {
    if (fields.title !== undefined) {
      targetLocale === "en" ? setEnTitle(fields.title) : setArTitle(fields.title);
    }
    if (fields.excerpt !== undefined) {
      targetLocale === "en" ? setEnExcerpt(fields.excerpt) : setArExcerpt(fields.excerpt);
    }
    if (fields.content !== undefined) {
      targetLocale === "en" ? setEnContent(fields.content) : setArContent(fields.content);
    }
    if (fields.slug !== undefined) {
      setSlug(fields.slug);
    }
    if (fields.tags && fields.tags.length > 0) {
      const newIds: string[] = [];
      for (const tagName of fields.tags) {
        const existing = allTags.find((t) => t.name.toLowerCase() === tagName.toLowerCase());
        if (existing) {
          newIds.push(existing.id);
        } else {
          const res = await fetch("/api/tags", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: tagName }),
          });
          if (res.ok) {
            const created = await res.json();
            setAllTags((prev) => [...prev, created]);
            newIds.push(created.id);
          }
        }
      }
      setSelectedTagIds(newIds);
    }
    if (fields.categories && fields.categories.length > 0) {
      const newIds: string[] = [];
      for (const catName of fields.categories) {
        const existing = allCategories.find((c) => c.name.toLowerCase() === catName.toLowerCase());
        if (existing) {
          newIds.push(existing.id);
        } else {
          const res = await fetch("/api/categories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: catName }),
          });
          if (res.ok) {
            const created = await res.json();
            setAllCategories((prev) => [...prev, created]);
            newIds.push(created.id);
          }
        }
      }
      setSelectedCategoryIds(newIds);
    }
    setAiActiveLocale(targetLocale);
  };

  const availableTagsStr = allTags.map((t) => t.name).join(", ");
  const availableCategoriesStr = allCategories.map((c) => c.name).join(", ");

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">{isNew ? "New Blog Post" : "Edit Blog Post"}</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-sm">Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} />

          <div>
            <p className="text-sm font-medium mb-2">Cover Image</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageUpload}
              className="hidden"
            />
            {coverImage ? (
              <div className="relative inline-block">
                <img src={coverImage} alt="Cover" className="h-32 w-48 object-cover rounded-md border" />
                <button
                  onClick={() => setCoverImage("")}
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  type="button"
                >
                  <Upload className="me-2 h-4 w-4" />
                  {uploading ? "Uploading..." : "Upload New"}
                </Button>
                <MediaPicker
                  accept="image"
                  onSelect={(url) => setCoverImage(url)}
                />
              </div>
            )}
          </div>

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

          <div>
            <p className="text-sm font-medium mb-2">Categories</p>
            <InlineTaxonomyCreator
              type="category"
              items={allCategories}
              selectedIds={selectedCategoryIds}
              onToggle={(id) => toggleId(selectedCategoryIds, setSelectedCategoryIds, id)}
              onCreated={(item) => setAllCategories((prev) => [...prev, item])}
            />
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Tags</p>
            <InlineTaxonomyCreator
              type="tag"
              items={allTags}
              selectedIds={selectedTagIds}
              onToggle={(id) => toggleId(selectedTagIds, setSelectedTagIds, id)}
              onCreated={(item) => setAllTags((prev) => [...prev, item])}
            />
          </div>
        </CardContent>
      </Card>

      <Tabs
        value={aiActiveLocale}
        onValueChange={(v) => setAiActiveLocale(v as "en" | "ar")}
      >
        <TabsList>
          <TabsTrigger value="en">English</TabsTrigger>
          <TabsTrigger value="ar">العربية</TabsTrigger>
        </TabsList>
        <TabsContent value="en" className="space-y-4 mt-4">
          <Input placeholder="Title (English)" value={enTitle} onChange={(e) => setEnTitle(e.target.value)} />
          <Textarea placeholder="Excerpt (English)" value={enExcerpt} onChange={(e) => setEnExcerpt(e.target.value)} />
          <div>
            <p className="text-sm font-medium mb-2">Content (Markdown)</p>
            <MarkdownEditor
              value={enContent}
              onChange={setEnContent}
              height={400}
              onOpenAi={() => openAiPanel("en")}
            />
          </div>
        </TabsContent>
        <TabsContent value="ar" className="space-y-4 mt-4">
          <Input placeholder="العنوان (عربي)" dir="rtl" value={arTitle} onChange={(e) => setArTitle(e.target.value)} />
          <Textarea placeholder="المقتطف (عربي)" dir="rtl" value={arExcerpt} onChange={(e) => setArExcerpt(e.target.value)} />
          <div>
            <p className="text-sm font-medium mb-2">المحتوى (ماركداون)</p>
            <MarkdownEditor
              value={arContent}
              onChange={setArContent}
              height={400}
              dir="rtl"
              onOpenAi={() => openAiPanel("ar")}
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex gap-3 items-center">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
        <Button variant="outline" onClick={() => router.push("/admin/blog")}>Cancel</Button>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      <AiChatPanel
        isOpen={aiPanelOpen}
        onClose={() => setAiPanelOpen(false)}
        currentContent={currentContent}
        title={currentTitle}
        excerpt={currentExcerpt}
        locale={aiActiveLocale}
        entityType="blog"
        availableTags={availableTagsStr}
        availableCategories={availableCategoriesStr}
        onApplyFields={handleAiApplyFields}
        onSwitchLocale={setAiActiveLocale}
      />
    </div>
  );
}
