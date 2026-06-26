"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, Bot, AlertCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";
import { InlineTaxonomyCreator } from "@/components/admin/InlineTaxonomyCreator";
import { AiChatPanel } from "@/components/admin/AiChatPanel";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

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
  const [loading, setLoading] = useState(true);
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
  const [isDirty, setIsDirty] = useState(false);
  const [locale, setLocale] = useState<"en" | "ar">("en");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [aiActiveLocale, setAiActiveLocale] = useState<"en" | "ar">("en");

  const loadedRef = useRef<string>("");

  const snapshotState = useCallback(() => {
    return JSON.stringify({
      slug, coverImage, readingTime, featured, status,
      enTitle, enExcerpt, enContent,
      arTitle, arExcerpt, arContent,
      selectedCategoryIds, selectedTagIds,
    });
  }, [slug, coverImage, readingTime, featured, status, enTitle, enExcerpt, enContent, arTitle, arExcerpt, arContent, selectedCategoryIds, selectedTagIds]);

  useEffect(() => {
    setIsDirty(loadedRef.current !== "" && snapshotState() !== loadedRef.current);
  }, [snapshotState]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  useEffect(() => {
    Promise.all([
      fetch("/api/categories").then((r) => r.json()).then(setAllCategories).catch(() => {}),
      fetch("/api/tags").then((r) => r.json()).then(setAllTags).catch(() => {}),
    ]);
  }, []);

  useEffect(() => {
    params.then(({ id: blogId }) => {
      setId(blogId);
      if (blogId === "new") {
        setIsNew(false);
        setLoading(false);
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
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to load post data. Please refresh.");
          setLoading(false);
        });
    });
  }, [params]);

  useEffect(() => {
    if (!loading) {
      loadedRef.current = snapshotState();
    }
  }, [loading, snapshotState]);

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

      loadedRef.current = snapshotState();
      setIsDirty(false);
      router.push("/admin/blog");
    } catch {
      setError("Network error. Please try again.");
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      if (!window.confirm("You have unsaved changes. Are you sure you want to leave?")) {
        return;
      }
    }
    router.push("/admin/blog");
  };

  const openAiPanel = (loc: "en" | "ar") => {
    setAiActiveLocale(loc);
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
    setLocale(targetLocale);
  };

  const availableTagsStr = allTags.map((t) => t.name).join(", ");
  const availableCategoriesStr = allCategories.map((c) => c.name).join(", ");

  if (loading) {
    return (
      <div className="max-w-3xl space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          {isNew ? "New Blog Post" : "Edit Blog Post"}
        </h1>
        <Button variant="outline" size="sm" onClick={() => openAiPanel(locale)}>
          <Bot className="h-4 w-4 me-1" />
          AI Assistant
        </Button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-2 p-3 mb-6 rounded-md bg-destructive/10 text-destructive text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span className="flex-1">{error}</span>
          <button onClick={() => setError("")}>
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Content Tabs — Primary Area */}
      <Tabs value={locale} onValueChange={(v) => setLocale(v as "en" | "ar")}>
        <TabsList>
          <TabsTrigger value="en">
            English
            {enContent && <span className="h-1.5 w-1.5 rounded-full bg-primary inline-block ms-1.5" />}
          </TabsTrigger>
          <TabsTrigger value="ar">
            العربية
            {arContent && <span className="h-1.5 w-1.5 rounded-full bg-primary inline-block ms-1.5" />}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="en" className="space-y-4 mt-4">
          <Input
            placeholder="Title (English)"
            value={enTitle}
            onChange={(e) => setEnTitle(e.target.value)}
          />
          <Textarea
            placeholder="Excerpt (English)"
            value={enExcerpt}
            onChange={(e) => setEnExcerpt(e.target.value)}
            rows={3}
          />
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
          <Input
            placeholder="العنوان (عربي)"
            dir="rtl"
            value={arTitle}
            onChange={(e) => setArTitle(e.target.value)}
          />
          <Textarea
            placeholder="المقتطف (عربي)"
            dir="rtl"
            value={arExcerpt}
            onChange={(e) => setArExcerpt(e.target.value)}
            rows={3}
          />
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

      {/* Settings — Collapsible Sections */}
      <Accordion defaultValue={["publication"]} className="mt-8">
        <AccordionItem value="publication">
          <AccordionTrigger>Publication</AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border rounded-md px-3 py-1.5 text-sm"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded"
                />
                Featured
              </label>
              <label className="flex items-center gap-2 text-sm">
                Reading time:
                <input
                  type="number"
                  value={readingTime}
                  onChange={(e) => setReadingTime(Number(e.target.value))}
                  className="w-16 border rounded px-2 py-1"
                />
                min
              </label>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="media">
          <AccordionTrigger>Media</AccordionTrigger>
          <AccordionContent>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageUpload}
              className="hidden"
            />
            {coverImage ? (
              <div className="relative inline-block">
                <img
                  src={coverImage}
                  alt="Cover"
                  className="h-24 sm:h-32 w-36 sm:w-48 object-cover rounded-md border"
                />
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
                  size="sm"
                >
                  <Upload className="me-2 h-4 w-4" />
                  {uploading ? "Uploading..." : "Upload Cover"}
                </Button>
                <MediaPicker accept="image" onSelect={(url) => setCoverImage(url)} />
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="taxonomy">
          <AccordionTrigger>Categories & Tags</AccordionTrigger>
          <AccordionContent className="space-y-4">
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
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="links">
          <AccordionTrigger>URL</AccordionTrigger>
          <AccordionContent>
            <Input
              placeholder="Slug (URL-friendly)"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Leave empty to auto-generate from the English title.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Sticky Save Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 z-40">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex gap-3">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
          {isDirty && (
            <span className="text-xs text-muted-foreground">Unsaved changes</span>
          )}
        </div>
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
        onSwitchLocale={(loc) => {
          setAiActiveLocale(loc);
          setLocale(loc);
        }}
      />
    </div>
  );
}
