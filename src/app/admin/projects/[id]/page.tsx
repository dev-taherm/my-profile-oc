"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Reorder } from "framer-motion";
import { Upload, X, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";

interface TaxonomyItem {
  id: string;
  name: string;
}

interface ProjectImage {
  url: string;
  order: number;
}

export default function AdminProjectEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [id, setId] = useState<string>("");
  const [isNew, setIsNew] = useState(false);
  const [slug, setSlug] = useState("");
  const [images, setImages] = useState<ProjectImage[]>([]);
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
  const [allCategories, setAllCategories] = useState<TaxonomyItem[]>([]);
  const [allTags, setAllTags] = useState<TaxonomyItem[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/categories").then((r) => r.json()).then(setAllCategories);
    fetch("/api/tags").then((r) => r.json()).then(setAllTags);
  }, []);

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
            setImages(p.projectImages?.map((img: { url: string; order: number }) => ({ url: img.url, order: img.order })).sort((a: ProjectImage, b: ProjectImage) => a.order - b.order) || []);
            setGithubUrl(p.githubUrl || "");
            setLiveUrl(p.liveUrl || "");
            setFeatured(p.featured);
            setStatus(p.status);
            setSelectedCategoryIds(p.categories?.map((c: TaxonomyItem) => c.id) || []);
            setSelectedTagIds(p.tags?.map((t: TaxonomyItem) => t.id) || []);
            const en = p.translations?.find((t: { locale: string }) => t.locale === "en");
            const ar = p.translations?.find((t: { locale: string }) => t.locale === "ar");
            if (en) { setEnTitle(en.title); setEnDescription(en.description); setEnContent(en.content || ""); }
            if (ar) { setArTitle(ar.title); setArDescription(ar.description); setArContent(ar.content || ""); }
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
      const res = await fetch("/api/upload?type=projects", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error || "Upload failed");
        return;
      }

      const { url } = await res.json();
      setImages((prev) => [...prev, { url, order: prev.length }]);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleReorder = (newOrder: ProjectImage[]) => {
    setImages(newOrder.map((img, i) => ({ ...img, order: i })));
  };

  const handleSave = async () => {
    setError("");
    setSaving(true);

    const data = {
      slug,
      images: images.map((img, i) => ({ url: img.url, order: i })),
      githubUrl: githubUrl || null,
      liveUrl: liveUrl || null,
      featured,
      status,
      categoryIds: selectedCategoryIds,
      tagIds: selectedTagIds,
      translations: [
        { locale: "en", title: enTitle, description: enDescription, content: enContent },
        { locale: "ar", title: arTitle || enTitle, description: arDescription || enDescription, content: arContent || enContent },
      ],
    };

    const url = isNew ? "/api/projects" : `/api/projects?id=${id}`;
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

      router.push("/admin/projects");
    } catch {
      setError("Network error. Please try again.");
      setSaving(false);
    }
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

          <div>
            <p className="text-sm font-medium mb-2">Project Images</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageUpload}
              className="hidden"
            />

            {images.length > 0 && (
              <Reorder.Group
                axis="x"
                values={images}
                onReorder={handleReorder}
                className="flex gap-3 flex-wrap mb-3"
              >
                {images.map((img) => (
                  <Reorder.Item
                    key={img.url}
                    value={img}
                    className="relative group cursor-grab active:cursor-grabbing"
                  >
                    <div className="relative">
                      <img
                        src={img.url}
                        alt={`Project image`}
                        className="h-28 w-40 object-cover rounded-md border"
                      />
                      <div className="absolute top-1 left-1">
                        <GripVertical className="h-4 w-4 text-white drop-shadow-md" />
                      </div>
                      {img.order === 0 && (
                        <div className="absolute top-1 right-8">
                          <Badge variant="default" className="text-[10px] px-1.5 py-0">Cover</Badge>
                        </div>
                      )}
                      <button
                        onClick={() => removeImage(img.order)}
                        className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            )}

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
                onSelect={(url) =>
                  setImages((prev) => [...prev, { url, order: prev.length }])
                }
              />
            </div>
            {images.length > 0 && (
              <p className="text-xs text-muted-foreground mt-2">Drag to reorder. First image is the cover.</p>
            )}
          </div>

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

          <div>
            <p className="text-sm font-medium mb-2">Categories</p>
            <div className="flex flex-wrap gap-2">
              {allCategories.map((cat) => (
                <label key={cat.id} className="flex items-center gap-1.5 text-sm border rounded-md px-3 py-1.5 cursor-pointer hover:bg-accent">
                  <input
                    type="checkbox"
                    checked={selectedCategoryIds.includes(cat.id)}
                    onChange={() => toggleId(selectedCategoryIds, setSelectedCategoryIds, cat.id)}
                  />
                  {cat.name}
                </label>
              ))}
              {allCategories.length === 0 && <p className="text-sm text-muted-foreground">No categories available</p>}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Tags</p>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <label key={tag.id} className="flex items-center gap-1.5 text-sm border rounded-md px-3 py-1.5 cursor-pointer hover:bg-accent">
                  <input
                    type="checkbox"
                    checked={selectedTagIds.includes(tag.id)}
                    onChange={() => toggleId(selectedTagIds, setSelectedTagIds, tag.id)}
                  />
                  {tag.name}
                </label>
              ))}
              {allTags.length === 0 && <p className="text-sm text-muted-foreground">No tags available</p>}
            </div>
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
          <div>
            <p className="text-sm font-medium mb-2">Content (Markdown)</p>
            <MarkdownEditor value={enContent} onChange={setEnContent} height={400} />
          </div>
        </TabsContent>
        <TabsContent value="ar" className="space-y-4 mt-4">
          <Input placeholder="العنوان (عربي)" dir="rtl" value={arTitle} onChange={(e) => setArTitle(e.target.value)} />
          <Textarea placeholder="الوصف (عربي)" dir="rtl" value={arDescription} onChange={(e) => setArDescription(e.target.value)} />
          <div>
            <p className="text-sm font-medium mb-2">المحتوى (ماركداون)</p>
            <MarkdownEditor value={arContent} onChange={setArContent} height={400} dir="rtl" />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex gap-3 items-center">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
        <Button variant="outline" onClick={() => router.push("/admin/projects")}>Cancel</Button>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
}
