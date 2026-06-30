"use client";

import { useState, useEffect, useRef } from "react";
import { Sparkles, Send, Loader2, Copy, Check, FileText, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface ContentItem {
  id: string;
  slug: string;
  status: string;
  featured: boolean;
  coverImage?: string;
  projectImages?: { url: string; order: number }[];
  translations: { locale: string; title: string; description?: string; excerpt?: string }[];
}

interface SocialPostComposerProps {
  hasTelegram: boolean;
  onPostSent?: () => void;
}

export function SocialPostComposer({ hasTelegram, onPostSent }: SocialPostComposerProps) {
  const [sourceType, setSourceType] = useState<"custom" | "project" | "blog">("custom");
  const [platform, setPlatform] = useState<"linkedin" | "facebook">("linkedin");
  const [tone, setTone] = useState<"professional" | "viral" | "mix">("professional");
  const [locale, setLocale] = useState<"en" | "ar">("en");
  const [content, setContent] = useState("");
  const [sourceId, setSourceId] = useState<string | null>(null);
  const [searchTopic, setSearchTopic] = useState("");

  const [projects, setProjects] = useState<ContentItem[]>([]);
  const [blogPosts, setBlogPosts] = useState<ContentItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);

  const [generating, setGenerating] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Fetch content when sourceType changes to project or blog
  useEffect(() => {
    if (sourceType === "custom") return;

    setLoadingItems(true);
    setSourceId(null);

    const endpoint = sourceType === "project" ? "/api/projects?status=PUBLISHED" : "/api/blog?status=PUBLISHED";

    fetch(endpoint)
      .then((r) => r.json())
      .then((data) => {
        if (sourceType === "project") {
          setProjects(data);
        } else {
          setBlogPosts(data);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingItems(false));
  }, [sourceType]);

  const items = sourceType === "project" ? projects : blogPosts;
  const selectedItem = items.find((i) => i.id === sourceId);

  const getTranslation = (item: ContentItem) => {
    return (
      item.translations.find((t) => t.locale === locale) ||
      item.translations[0]
    );
  };

  const handleGenerate = async () => {
    setError("");
    setSuccess("");

    if (sourceType === "custom" && !content.trim()) {
      setError("Please enter some content first");
      return;
    }

    if (sourceType === "custom" && !searchTopic.trim()) {
      setError("Please enter a search topic so AI can find trending context");
      return;
    }

    if (sourceType !== "custom" && !sourceId) {
      setError(`Please select a ${sourceType}`);
      return;
    }

    setGenerating(true);

    try {
      const body: Record<string, string> = {
        platform,
        locale,
        tone,
      };

      if (sourceType === "custom") {
        body.content = content;
        body.searchTopic = searchTopic;
      } else {
        body.sourceType = sourceType;
        body.sourceId = sourceId!;
      }

      const res = await fetch("/api/social/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Generation failed");
        return;
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let generated = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6).trim();
              if (data === "[DONE]") continue;
              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  generated += parsed.content;
                  setContent(generated);
                }
              } catch {
                // skip
              }
            }
          }
        }
      }
    } catch {
      setError("Generation failed. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleSendToTelegram = async () => {
    if (!content.trim()) {
      setError("Content cannot be empty");
      return;
    }

    setSending(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/social/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, platform, tone }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to send");
        return;
      }

      setSuccess(`Sent to Telegram! Ready to post on ${platform === "linkedin" ? "LinkedIn" : "Facebook"}.`);
      setContent("");
      setSourceId(null);
      onPostSent?.();
    } catch {
      setError("Failed to send. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleCopy = async () => {
    if (!content.trim()) return;
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Failed to copy to clipboard");
    }
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-5">
        {/* Source Type */}
        <div>
          <label className="text-sm font-medium mb-2 block">Content Source</label>
          <div className="flex gap-2">
            {[
              { value: "custom" as const, label: "Custom", icon: FileText },
              { value: "project" as const, label: "Project", icon: FolderOpen },
              { value: "blog" as const, label: "Blog Post", icon: FileText },
            ].map(({ value, label, icon: Icon }) => (
              <Button
                key={value}
                variant={sourceType === value ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setSourceType(value);
                  setContent("");
                  setSourceId(null);
                }}
              >
                <Icon className="h-3.5 w-3.5 me-1.5" />
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Platform + Tone */}
        <div className="flex flex-wrap gap-6">
          <div>
            <label className="text-sm font-medium mb-2 block">Target Platform</label>
            <div className="flex gap-2">
              <Button
                variant={platform === "linkedin" ? "default" : "outline"}
                size="sm"
                onClick={() => setPlatform("linkedin")}
              >
                LinkedIn
              </Button>
              <Button
                variant={platform === "facebook" ? "default" : "outline"}
                size="sm"
                onClick={() => setPlatform("facebook")}
              >
                Facebook
              </Button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Tone</label>
            <div className="flex gap-2">
              <Button
                variant={tone === "professional" ? "default" : "outline"}
                size="sm"
                onClick={() => setTone("professional")}
              >
                Professional
              </Button>
              <Button
                variant={tone === "viral" ? "default" : "outline"}
                size="sm"
                onClick={() => setTone("viral")}
              >
                Viral
              </Button>
              <Button
                variant={tone === "mix" ? "default" : "outline"}
                size="sm"
                onClick={() => setTone("mix")}
              >
                Mix
              </Button>
            </div>
          </div>
        </div>

        {/* Locale (when project or blog selected) */}
        {sourceType !== "custom" && (
          <div>
            <label className="text-sm font-medium mb-2 block">Language</label>
            <div className="flex gap-2">
              <Button
                variant={locale === "en" ? "default" : "outline"}
                size="sm"
                onClick={() => setLocale("en")}
              >
                English
              </Button>
              <Button
                variant={locale === "ar" ? "default" : "outline"}
                size="sm"
                onClick={() => setLocale("ar")}
              >
                العربية
              </Button>
            </div>
          </div>
        )}

        {/* Search Topic (for custom content) */}
        {sourceType === "custom" && (
          <div>
            <label className="text-sm font-medium mb-2 block">Search Topic</label>
            <input
              type="text"
              value={searchTopic}
              onChange={(e) => setSearchTopic(e.target.value)}
              placeholder="e.g. RAG AI systems, Next.js performance, Django REST"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Helps AI find current trends for your post
            </p>
          </div>
        )}

        {/* Content Input Area */}
        {sourceType === "custom" ? (
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your content or idea here, then click AI Generate..."
            className="min-h-[150px] resize-y"
          />
        ) : (
          <div className="space-y-3">
            {loadingItems ? (
              <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
                <Loader2 className="h-4 w-4 me-2 animate-spin" />
                Loading {sourceType === "project" ? "projects" : "blog posts"}...
              </div>
            ) : items.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No published {sourceType === "project" ? "projects" : "blog posts"} found
              </p>
            ) : (
              <>
                <select
                  value={sourceId || ""}
                  onChange={(e) => setSourceId(e.target.value || null)}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select a {sourceType}...</option>
                  {items.map((item) => {
                    const t = getTranslation(item);
                    return (
                      <option key={item.id} value={item.id}>
                        {t?.title || item.slug}
                      </option>
                    );
                  })}
                </select>

                {selectedItem && (
                  <div className="rounded-lg border p-3 bg-muted/30">
                    <div className="flex items-start gap-3">
                      {(selectedItem.coverImage || selectedItem.projectImages?.[0]?.url) && (
                        <img
                          src={selectedItem.coverImage || selectedItem.projectImages?.[0]?.url}
                          alt=""
                          className="h-12 w-12 rounded object-cover shrink-0"
                        />
                      )}
                      <div className="min-w-0">
                        <p className="font-medium text-sm line-clamp-1">
                          {getTranslation(selectedItem)?.title}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {getTranslation(selectedItem)?.description ||
                            getTranslation(selectedItem)?.excerpt ||
                            "No description"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Generated / Editable Output */}
        {content && sourceType !== "custom" && (
          <div>
            <label className="text-sm font-medium mb-2 block">Generated Post (editable)</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[150px] resize-y"
            />
          </div>
        )}

        {/* Error / Success */}
        {error && <p className="text-sm text-destructive">{error}</p>}
        {success && <p className="text-sm text-green-600 dark:text-green-400">{success}</p>}

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={handleGenerate}
            disabled={
              generating ||
              (sourceType === "custom" && !content.trim()) ||
              (sourceType === "custom" && !searchTopic.trim()) ||
              (sourceType !== "custom" && !sourceId)
            }
          >
            {generating ? (
              <Loader2 className="h-4 w-4 me-1.5 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 me-1.5" />
            )}
            AI Generate
          </Button>

          <Button variant="outline" onClick={handleCopy} disabled={!content.trim()}>
            {copied ? (
              <Check className="h-4 w-4 me-1.5" />
            ) : (
              <Copy className="h-4 w-4 me-1.5" />
            )}
            {copied ? "Copied!" : "Copy"}
          </Button>

          <Button
            onClick={handleSendToTelegram}
            disabled={sending || !content.trim() || !hasTelegram}
          >
            {sending ? (
              <Loader2 className="h-4 w-4 me-1.5 animate-spin" />
            ) : (
              <Send className="h-4 w-4 me-1.5" />
            )}
            Send to Telegram
          </Button>
        </div>

        {!hasTelegram && (
          <p className="text-xs text-muted-foreground">
            Configure a Telegram bot above to send posts directly
          </p>
        )}
      </CardContent>
    </Card>
  );
}
