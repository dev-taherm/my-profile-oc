"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import {
  X,
  Send,
  Bot,
  User,
  Loader2,
  Trash2,
  FileText,
  Hammer,
  Check,
  XCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAiStream, type ChatMessage } from "@/hooks/use-ai-stream";
import { useAiPanel } from "@/contexts/AiPanelContext";
import { type AiFieldUpdates, type AiPendingUpdate } from "@/lib/ai-providers";

interface AiChatPanelProps {
  currentContent: string;
  title: string;
  excerpt?: string;
  locale: string;
  entityType: "blog" | "project";
  availableTags: string;
  availableCategories: string;
  existingArticles?: string;
  onApplyFields: (fields: AiFieldUpdates, targetLocale: "en" | "ar") => void;
  onSwitchLocale?: (locale: "en" | "ar") => void;
  onClose?: () => void;
}

const FIELD_LABELS: Record<string, string> = {
  title: "Title",
  excerpt: "Excerpt",
  content: "Content",
  slug: "Slug",
  tags: "Tags",
  categories: "Categories",
  metaDescription: "Meta Description",
  relatedArticles: "Related Articles",
};

const SUGGESTIONS: Record<string, string[]> = {
  blog: [
    "Write an article answering a common Django question",
    "Add an FAQ section to this article",
    "Rewrite with personal experience and code examples",
    "Optimize for SEO and AI citation",
    "Suggest internal links to related articles",
  ],
  project: [
    "Write a detailed project description with architecture",
    "Add code examples and tech stack details",
    "Include challenges and lessons learned",
    "Suggest related projects for topic clustering",
    "Optimize project for AI discoverability",
  ],
};

export function AiChatPanel({
  currentContent,
  title,
  excerpt,
  locale,
  entityType,
  availableTags,
  availableCategories,
  existingArticles,
  onApplyFields,
  onSwitchLocale,
  onClose,
}: AiChatPanelProps) {
  const [input, setInput] = useState("");
  const [autoApply, setAutoApply] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { updatePanelData } = useAiPanel();
  const {
    isGenerating,
    streamedText,
    messages,
    error,
    pendingUpdate,
    sendMessage,
    stopGeneration,
    clearPendingUpdate,
    clearChat,
  } = useAiStream();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamedText]);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 200);
  }, []);

  useEffect(() => {
    if (pendingUpdate && autoApply) {
      handleApplyUpdate(pendingUpdate);
    }
  }, [pendingUpdate, autoApply]);

  const handleSend = async (prefix?: string) => {
    const message = input.trim();
    if (!message && !prefix) return;
    if (isGenerating) return;

    const fullMessage = prefix ? `${prefix} ${message}` : message;

    setInput("");
    await sendMessage({
      prompt: fullMessage,
      entityType,
      locale,
      title,
      excerpt: excerpt || "",
      currentContent,
      availableTags,
      availableCategories,
    });
  };

  const handlePlan = () => {
    handleSend("[PLAN]");
  };

  const handleBuild = () => {
    handleSend("[BUILD]");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleApplyUpdate = (update: AiPendingUpdate) => {
    onApplyFields(update.fields, update.locale);
    onSwitchLocale?.(update.locale);

    // Sync applied content back to panel context so next AI call sees updated content
    const updates: Record<string, string> = {};
    if (update.fields.content !== undefined) {
      updates.currentContent = update.fields.content;
    }
    if (update.fields.title !== undefined) {
      updates.title = update.fields.title;
    }
    if (update.fields.excerpt !== undefined) {
      updates.excerpt = update.fields.excerpt;
    }
    if (update.locale) {
      updates.locale = update.locale;
    }
    if (Object.keys(updates).length > 0) {
      updatePanelData(updates);
    }

    clearPendingUpdate();
  };

  const handleDiscardUpdate = () => {
    clearPendingUpdate();
  };

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const suggestions = SUGGESTIONS[entityType] || SUGGESTIONS.blog;

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">AI Agent</h3>
          <Badge variant="secondary" className="text-[10px]">
            {entityType === "blog" ? "Blog" : "Project"}
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <Button variant="ghost" size="icon-xs" onClick={clearChat} title="Clear chat">
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
          {onClose && (
            <Button variant="ghost" size="icon-xs" onClick={onClose} title="Close panel">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !streamedText && (
          <div className="text-center py-8">
            <Bot className="h-10 w-10 mx-auto mb-3 text-primary" />
            <p className="text-sm font-medium">AI Content Agent</p>
            <p className="text-xs text-muted-foreground mt-1">
              Write, edit, translate, and optimize your content.
            </p>
            <div className="flex flex-wrap gap-2 mt-4 justify-center px-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSuggestion(s)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded-full border hover:bg-muted transition-colors"
                >
                  <Sparkles className="h-3 w-3" />
                  {s}
                </button>
              ))}
            </div>
            {existingArticles && (
              <div className="mt-6 text-left max-w-sm mx-auto">
                <p className="text-[11px] font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                  Existing articles on this site:
                </p>
                <div className="space-y-1">
                  {existingArticles.split("\n").slice(0, 8).map((line, i) => (
                    <p key={i} className="text-xs text-muted-foreground truncate">{line}</p>
                  ))}
                  {existingArticles.split("\n").length > 8 && (
                    <p className="text-xs text-muted-foreground italic">
                      +{existingArticles.split("\n").length - 8} more
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}

        {streamedText && (
          <div className="flex gap-2">
            <div className="shrink-0 mt-1">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div className="rounded-lg px-3 py-2 text-sm bg-muted/50 border border-primary/20 max-w-[85%]">
              <div className="prose prose-xs max-w-none dark:prose-invert">
                {streamedText}
                <span className="inline-block w-1.5 h-3.5 bg-primary/70 animate-pulse ml-0.5 align-text-bottom" />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-lg px-3 py-2 text-sm bg-destructive/10 text-destructive border border-destructive/20">
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Pending Update Banner */}
      {pendingUpdate && !autoApply && (
        <div className="mx-3 mb-2 rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium">Ready to apply</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <span>Target:</span>
              <Badge variant="outline" className="text-[10px]">
                {pendingUpdate.locale === "en" ? "English" : "Arabic"}
              </Badge>
            </div>

            {pendingUpdate.fields.title && (
              <div>
                <span className="font-medium text-muted-foreground">Title:</span>
                <p className="mt-0.5 truncate">{pendingUpdate.fields.title}</p>
              </div>
            )}
            {pendingUpdate.fields.excerpt && (
              <div>
                <span className="font-medium text-muted-foreground">Excerpt:</span>
                <p className="mt-0.5 line-clamp-2">{pendingUpdate.fields.excerpt}</p>
              </div>
            )}
            {pendingUpdate.fields.content && (
              <div>
                <span className="font-medium text-muted-foreground">Content:</span>
                <p className="mt-0.5 line-clamp-3">
                  {pendingUpdate.fields.content.slice(0, 300)}
                  {pendingUpdate.fields.content.length > 300 ? "..." : ""}
                </p>
              </div>
            )}
            {pendingUpdate.fields.slug && (
              <div>
                <span className="font-medium text-muted-foreground">Slug:</span>
                <p className="mt-0.5 font-mono">{pendingUpdate.fields.slug}</p>
              </div>
            )}
            {pendingUpdate.fields.tags && pendingUpdate.fields.tags.length > 0 && (
              <div>
                <span className="font-medium text-muted-foreground">Tags:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {pendingUpdate.fields.tags.map((t) => (
                    <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>
                  ))}
                </div>
              </div>
            )}
            {pendingUpdate.fields.categories && pendingUpdate.fields.categories.length > 0 && (
              <div>
                <span className="font-medium text-muted-foreground">Categories:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {pendingUpdate.fields.categories.map((c) => (
                    <Badge key={c} variant="secondary" className="text-[10px]">{c}</Badge>
                  ))}
                </div>
              </div>
            )}
            {pendingUpdate.fields.metaDescription && (
              <div>
                <span className="font-medium text-muted-foreground">Meta Description:</span>
                <p className="mt-0.5 line-clamp-2">{pendingUpdate.fields.metaDescription}</p>
              </div>
            )}
            {pendingUpdate.fields.relatedArticles && pendingUpdate.fields.relatedArticles.length > 0 && (
              <div>
                <span className="font-medium text-muted-foreground">Related Articles:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {pendingUpdate.fields.relatedArticles.map((a) => (
                    <Badge key={a} variant="secondary" className="text-[10px]">{a}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-1">
            <Button
              size="sm"
              onClick={() => handleApplyUpdate(pendingUpdate)}
              className="h-8"
            >
              <Check className="h-3.5 w-3.5 me-1" />
              Apply to {pendingUpdate.locale === "en" ? "EN" : "AR"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleDiscardUpdate}
              className="h-8"
            >
              <XCircle className="h-3.5 w-3.5 me-1" />
              Discard
            </Button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t p-3 shrink-0">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe what you need..."
            rows={2}
            className="flex-1 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
          <div className="flex flex-col gap-1">
            {isGenerating ? (
              <Button
                variant="destructive"
                size="icon"
                onClick={stopGeneration}
                title="Stop generation"
              >
                <Loader2 className="h-4 w-4 animate-spin" />
              </Button>
            ) : (
              <Button
                size="icon"
                onClick={() => handleSend()}
                disabled={!input.trim()}
                title="Send"
              >
                <Send className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Plan & Build buttons */}
        <div className="flex gap-2 mt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 h-8 text-xs"
            onClick={handlePlan}
            disabled={isGenerating}
            title="Generate a structured plan"
          >
            <FileText className="h-3 w-3 me-1" />
            Plan
          </Button>
          <Button
            size="sm"
            className="flex-1 h-8 text-xs"
            onClick={handleBuild}
            disabled={isGenerating}
            title="Build and apply changes"
          >
            <Hammer className="h-3 w-3 me-1" />
            Build
          </Button>
        </div>

        <div className="flex items-center justify-between mt-2">
          <label className="flex items-center gap-1.5 text-[11px] text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={autoApply}
              onChange={(e) => setAutoApply(e.target.checked)}
              className="rounded"
            />
            Auto-apply
          </label>
          {messages.some((m) => m.role === "assistant") && (
            <button
              onClick={() => {
                const last = [...messages].reverse().find((m) => m.role === "assistant");
                if (last) navigator.clipboard.writeText(last.cleanContent || last.content);
              }}
              className="text-[11px] text-muted-foreground hover:text-foreground"
            >
              Copy last
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div className="flex gap-2">
      <div className="shrink-0 mt-1">
        {isUser ? (
          <User className="h-4 w-4 text-muted-foreground" />
        ) : (
          <Bot className="h-4 w-4 text-primary" />
        )}
      </div>
      <div
        className={`rounded-lg px-3 py-2 text-sm max-w-[85%] ${
          isUser
            ? "bg-primary text-primary-foreground ml-auto"
            : "bg-muted/50 border"
        }`}
      >
        {isUser ? (
          <div className="whitespace-pre-wrap break-words text-xs leading-relaxed">
            {message.content}
          </div>
        ) : (
          <div className="prose prose-xs max-w-none dark:prose-invert">
            <ReactMarkdown>{message.cleanContent || message.content}</ReactMarkdown>
          </div>
        )}
        {message.pendingUpdate && (
          <Badge variant="outline" className="text-[10px] mt-1">
            Updates for {message.pendingUpdate.locale === "en" ? "EN" : "AR"}
          </Badge>
        )}
      </div>
    </div>
  );
}
