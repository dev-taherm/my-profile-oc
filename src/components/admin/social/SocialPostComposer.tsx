"use client";

import { useState, useRef } from "react";
import { Sparkles, Send, Loader2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface SocialPostComposerProps {
  hasTelegram: boolean;
  onPostSent?: () => void;
}

export function SocialPostComposer({ hasTelegram, onPostSent }: SocialPostComposerProps) {
  const [content, setContent] = useState("");
  const [generating, setGenerating] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleGenerate = async () => {
    if (!content.trim()) {
      setError("Please enter some content first");
      return;
    }

    setGenerating(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/social/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
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
        body: JSON.stringify({ content }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to send");
        return;
      }

      setSuccess("Sent to Telegram! Check your bot for the post.");
      setContent("");
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
      <CardHeader>
        <CardTitle className="text-base">Create Post</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your social media post here, or describe what you want to post and let AI generate it..."
          className="min-h-[200px] resize-y"
        />

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
        {success && (
          <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
        )}

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={handleGenerate}
            disabled={generating || !content.trim()}
          >
            {generating ? (
              <Loader2 className="h-4 w-4 me-1.5 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 me-1.5" />
            )}
            AI Generate
          </Button>

          <Button
            variant="outline"
            onClick={handleCopy}
            disabled={!content.trim()}
          >
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
