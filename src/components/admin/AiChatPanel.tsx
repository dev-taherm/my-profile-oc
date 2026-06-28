"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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
  Copy,
  RefreshCw,
  Pencil,
  CheckCheck,
  Search,
  Undo2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAiStream, type ChatMessage } from "@/hooks/use-ai-stream";
import { useAiPanel } from "@/contexts/AiPanelContext";
import { type AiPendingUpdate, type AiFieldUpdates } from "@/lib/ai-providers";

interface AiChatPanelProps {
  currentContent: string;
  title: string;
  excerpt: string;
  locale: string;
  entityType: "blog" | "project";
  availableTags: string;
  availableCategories: string;
  existingArticles?: string;
  storageKey?: string;
  onClose: () => void;
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

function getSmartSuggestions(
  entityType: string,
  title: string,
  excerpt: string,
  content: string,
  tags: string,
  locale: string,
): string[] {
  const suggestions: string[] = [];

  if (!content || content.length < 50) {
    if (entityType === "blog") {
      suggestions.push("Write an article answering a common developer question");
      suggestions.push("Plan the article structure with headings and sections");
    } else {
      suggestions.push("Write a detailed project description with architecture");
      suggestions.push("Plan the project documentation structure");
    }
  } else {
    if (entityType === "blog") {
      if (!content.toLowerCase().includes("faq")) {
        suggestions.push("Add an FAQ section to this article");
      }
      if (!content.includes("```")) {
        suggestions.push("Add code examples with explanations");
      }
      suggestions.push("Rewrite with personal experience and opinions");
      suggestions.push("Optimize for SEO and AI citation");
      suggestions.push("Suggest internal links to related articles");
    } else {
      if (!content.includes("```")) {
        suggestions.push("Add code examples and tech stack details");
      }
      suggestions.push("Include challenges and lessons learned");
      suggestions.push("Suggest related projects for topic clustering");
      suggestions.push("Optimize project for AI discoverability");
    }
  }

  if (!tags) {
    suggestions.push("Generate relevant tags for this content");
  }

  if (!excerpt) {
    suggestions.push("Write a compelling excerpt/summary");
  }

  // Always include one general suggestion
  if (locale === "ar") {
    suggestions.push("Translate this content to English");
  } else {
    suggestions.push("Translate this content to Arabic");
  }

  return suggestions.slice(0, 6);
}

export function AiChatPanel({
  currentContent,
  title,
  excerpt,
  locale,
  entityType,
  availableTags,
  availableCategories,
  existingArticles,
  storageKey,
  onClose,
}: AiChatPanelProps) {
  const [input, setInput] = useState("");
  const [autoApply, setAutoApply] = useState(false);
  const [webSearch, setWebSearch] = useState(false);
  const [webSearchLoading, setWebSearchLoading] = useState(false);
  const [undoVisible, setUndoVisible] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { applyHandlerRef, switchLocaleHandlerRef, undoHandlerRef } = useAiPanel();
  const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    isGenerating,
    streamedText,
    messages,
    error,
    pendingUpdate,
    sendMessage,
    stopGeneration,
    regenerateLast,
    editMessage,
    removeMessage,
    clearPendingUpdate,
    clearChat,
    searchWeb,
  } = useAiStream(storageKey);

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

  // Cleanup undo timer on unmount
  useEffect(() => {
    return () => {
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    };
  }, []);

  const handleSend = useCallback(async (prefix?: string) => {
    const message = input.trim();
    if (!message && !prefix) return;
    if (isGenerating) return;

    const fullMessage = prefix ? `${prefix} ${message}` : message;
    setInput("");
    setWebSearchLoading(false);

    let webSearchCtx: string | undefined;

    // If web search is enabled, search first
    if (webSearch && !prefix?.startsWith("[PLAN]") && !prefix?.startsWith("[BUILD]")) {
      setWebSearchLoading(true);
      const results = await searchWeb(message);
      setWebSearchLoading(false);
      if (results) webSearchCtx = results;
    }

    await sendMessage({
      prompt: fullMessage,
      entityType,
      locale,
      title,
      excerpt: excerpt || "",
      currentContent,
      availableTags,
      availableCategories,
      webSearchContext: webSearchCtx,
    });
  }, [input, isGenerating, webSearch, searchWeb, entityType, locale, title, excerpt, currentContent, availableTags, availableCategories, sendMessage]);

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
    applyHandlerRef.current?.(update.fields, update.locale);
    switchLocaleHandlerRef.current?.(update.locale);
    clearPendingUpdate();

    // Show undo button for 10 seconds
    setUndoVisible(true);
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    undoTimerRef.current = setTimeout(() => setUndoVisible(false), 10000);
  };

  const handleUndo = () => {
    undoHandlerRef.current?.();
    setUndoVisible(false);
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
  };

  const handleDiscardUpdate = () => {
    clearPendingUpdate();
  };

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleCopyMessage = async (content: string, idx: number) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(idx);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRegenerate = () => {
    const userPrompt = regenerateLast();
    if (userPrompt) {
      // Remove the [PLAN]/[BUILD] prefix if present for re-sending
      const cleanPrompt = userPrompt.replace(/^\[(PLAN|BUILD|SEARCH)\]\s*/, "");
      setInput(cleanPrompt);
      // Slight delay so state updates
      setTimeout(() => {
        if (userPrompt.startsWith("[PLAN]")) handleSend("[PLAN]");
        else if (userPrompt.startsWith("[BUILD]")) handleSend("[BUILD]");
        else handleSend();
      }, 50);
    }
  };

  const handleStartEdit = (idx: number, content: string) => {
    setEditingIdx(idx);
    setEditText(content);
  };

  const handleSaveEdit = async () => {
    if (editingIdx === null) return;
    editMessage(editingIdx, editText);
    const editedMsg = messages[editingIdx];
    setEditingIdx(null);
    setEditText("");

    // If it was a user message, re-send it
    if (editedMsg.role === "user") {
      // Remove all messages after this one
      removeMessage(editingIdx);
      // Wait for state to settle, then send
      await new Promise((r) => setTimeout(r, 50));
      setInput(editText);
      setTimeout(() => handleSend(), 50);
    }
  };

  const handleCancelEdit = () => {
    setEditingIdx(null);
    setEditText("");
  };

  // Strip <ai-update> tags from streamed text for clean display
  const cleanStreamedText = streamedText.replace(/<ai-update[\s\S]*$/, "").trim();

  // Detect if AI is generating the update portion
  const isGeneratingUpdate = streamedText.includes("<ai-update");

  const suggestions = getSmartSuggestions(entityType, title, excerpt, currentContent, availableTags, locale);

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
          {undoVisible && (
            <Button variant="ghost" size="icon-xs" onClick={handleUndo} title="Undo last apply">
              <Undo2 className="h-3 w-3" />
            </Button>
          )}
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
          <MessageBubble
            key={i}
            message={msg}
            index={i}
            isLast={i === messages.length - 1 && msg.role === "assistant"}
            editingIdx={editingIdx}
            editText={editText}
            copiedId={copiedId}
            onCopy={handleCopyMessage}
            onRegenerate={handleRegenerate}
            onStartEdit={handleStartEdit}
            onSaveEdit={handleSaveEdit}
            onCancelEdit={handleCancelEdit}
            onEditTextChange={setEditText}
          />
        ))}

        {/* Streaming indicator */}
        {streamedText && (
          <div className="flex gap-2">
            <div className="shrink-0 mt-1">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div className="rounded-lg px-3 py-2 text-sm bg-muted/50 border border-primary/20 max-w-[85%]">
              <div className="prose prose-xs max-w-none dark:prose-invert">
                {cleanStreamedText || <span className="text-muted-foreground italic">Thinking...</span>}
                <span className="inline-block w-1.5 h-3.5 bg-primary/70 animate-pulse ml-0.5 align-text-bottom" />
              </div>
              {isGeneratingUpdate && (
                <p className="text-[10px] text-muted-foreground mt-1 italic">
                  Generating changes...
                </p>
              )}
            </div>
          </div>
        )}

        {/* Web search loading indicator */}
        {webSearchLoading && (
          <div className="flex gap-2">
            <div className="shrink-0 mt-1">
              <Search className="h-4 w-4 text-blue-500" />
            </div>
            <div className="rounded-lg px-3 py-2 text-sm bg-blue-500/5 border border-blue-500/20 text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Loader2 className="h-3 w-3 animate-spin" />
                Searching the web...
              </span>
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

      {/* Pending Update Banner — Diff Preview */}
      {pendingUpdate && !autoApply && (
        <PendingUpdateBanner
          update={pendingUpdate}
          onApply={() => handleApplyUpdate(pendingUpdate)}
          onDiscard={handleDiscardUpdate}
        />
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

        {/* Bottom toggles */}
        <div className="flex items-center justify-between mt-2 gap-2">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 text-[11px] text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={autoApply}
                onChange={(e) => setAutoApply(e.target.checked)}
                className="rounded"
              />
              Auto-apply
            </label>
            <label className="flex items-center gap-1.5 text-[11px] text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={webSearch}
                onChange={(e) => setWebSearch(e.target.checked)}
                className="rounded"
              />
              <Search className="h-3 w-3" />
              Web search
            </label>
          </div>
          {undoVisible && (
            <button
              onClick={handleUndo}
              className="text-[11px] text-primary hover:underline flex items-center gap-1"
            >
              <Undo2 className="h-3 w-3" />
              Undo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Pending Update Banner with Diff ────────────────────────────────

function PendingUpdateBanner({
  update,
  onApply,
  onDiscard,
}: {
  update: AiPendingUpdate;
  onApply: () => void;
  onDiscard: () => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const fields = update.fields;

  return (
    <div className="mx-3 mb-2 rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4 text-green-500" />
          <span className="text-sm font-medium">Ready to apply</span>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-[11px] text-muted-foreground hover:text-foreground"
        >
          {expanded ? "Collapse" : "Expand"}
        </button>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <span>Target:</span>
        <Badge variant="outline" className="text-[10px]">
          {update.locale === "en" ? "English" : "Arabic"}
        </Badge>
      </div>

      {expanded && (
        <div className="space-y-2 text-xs max-h-60 overflow-y-auto">
          {fields.title && (
            <FieldDiff label="Title" value={fields.title} />
          )}
          {fields.excerpt && (
            <FieldDiff label="Excerpt" value={fields.excerpt} maxLines={2} />
          )}
          {fields.content && (
            <FieldDiff label="Content" value={fields.content} maxLines={4} />
          )}
          {fields.slug && (
            <FieldDiff label="Slug" value={fields.slug} mono />
          )}
          {fields.tags && fields.tags.length > 0 && (
            <div>
              <span className="font-medium text-muted-foreground">Tags:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {fields.tags.map((t) => (
                  <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>
                ))}
              </div>
            </div>
          )}
          {fields.categories && fields.categories.length > 0 && (
            <div>
              <span className="font-medium text-muted-foreground">Categories:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {fields.categories.map((c) => (
                  <Badge key={c} variant="secondary" className="text-[10px]">{c}</Badge>
                ))}
              </div>
            </div>
          )}
          {fields.metaDescription && (
            <FieldDiff label="Meta Description" value={fields.metaDescription} maxLines={2} />
          )}
          {fields.relatedArticles && fields.relatedArticles.length > 0 && (
            <div>
              <span className="font-medium text-muted-foreground">Related Articles:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {fields.relatedArticles.map((a) => (
                  <Badge key={a} variant="secondary" className="text-[10px]">{a}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2 pt-1">
        <Button size="sm" onClick={onApply} className="h-8">
          <Check className="h-3.5 w-3.5 me-1" />
          Apply to {update.locale === "en" ? "EN" : "AR"}
        </Button>
        <Button size="sm" variant="outline" onClick={onDiscard} className="h-8">
          <XCircle className="h-3.5 w-3.5 me-1" />
          Discard
        </Button>
      </div>
    </div>
  );
}

function FieldDiff({
  label,
  value,
  maxLines = 3,
  mono = false,
}: {
  label: string;
  value: string;
  maxLines?: number;
  mono?: boolean;
}) {
  return (
    <div>
      <span className="font-medium text-muted-foreground">{label}:</span>
      <p className={`mt-0.5 ${mono ? "font-mono" : ""} line-clamp-${maxLines}`}>
        {value.length > 300 ? value.slice(0, 300) + "..." : value}
      </p>
    </div>
  );
}

// ─── Message Bubble with Actions ────────────────────────────────────

function MessageBubble({
  message,
  index,
  isLast,
  editingIdx,
  editText,
  copiedId,
  onCopy,
  onRegenerate,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onEditTextChange,
}: {
  message: ChatMessage;
  index: number;
  isLast: boolean;
  editingIdx: number | null;
  editText: string;
  copiedId: number | null;
  onCopy: (content: string, idx: number) => void;
  onRegenerate: () => void;
  onStartEdit: (idx: number, content: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onEditTextChange: (text: string) => void;
}) {
  const isUser = message.role === "user";
  const isEditing = editingIdx === index;
  const content = message.cleanContent || message.content;

  return (
    <div className="group relative flex gap-2">
      <div className="shrink-0 mt-1">
        {isUser ? (
          <User className="h-4 w-4 text-muted-foreground" />
        ) : (
          <Bot className="h-4 w-4 text-primary" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="space-y-1">
            <textarea
              value={editText}
              onChange={(e) => onEditTextChange(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
              autoFocus
            />
            <div className="flex gap-1">
              <Button size="sm" className="h-6 text-[10px]" onClick={onSaveEdit}>
                <Check className="h-3 w-3 me-0.5" /> Send
              </Button>
              <Button size="sm" variant="ghost" className="h-6 text-[10px]" onClick={onCancelEdit}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
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
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            )}
            {message.pendingUpdate && (
              <Badge variant="outline" className="text-[10px] mt-1">
                Updates for {message.pendingUpdate.locale === "en" ? "EN" : "AR"}
              </Badge>
            )}
          </div>
        )}

        {/* Message actions (visible on hover) */}
        {!isEditing && (
          <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onCopy(message.content, index)}
              className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
              title="Copy"
            >
              {copiedId === index ? (
                <CheckCheck className="h-3 w-3 text-green-500" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </button>
            {isUser && (
              <button
                onClick={() => onStartEdit(index, message.content)}
                className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                title="Edit & resend"
              >
                <Pencil className="h-3 w-3" />
              </button>
            )}
            {isLast && !isUser && (
              <button
                onClick={onRegenerate}
                className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                title="Regenerate"
              >
                <RefreshCw className="h-3 w-3" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
