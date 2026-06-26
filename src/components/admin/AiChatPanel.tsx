"use client";

import { useState, useRef, useEffect } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAiStream, type ChatMessage } from "@/hooks/use-ai-stream";
import { buildSystemPrompt, type AiFieldUpdates, type AiPendingUpdate } from "@/lib/ai-providers";

interface AiChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentContent: string;
  title: string;
  excerpt?: string;
  locale: string;
  entityType: "blog" | "project";
  availableTags: string;
  availableCategories: string;
  onApplyFields: (fields: AiFieldUpdates, targetLocale: "en" | "ar") => void;
  onSwitchLocale?: (locale: "en" | "ar") => void;
}

const FIELD_LABELS: Record<string, string> = {
  title: "Title",
  excerpt: "Excerpt",
  content: "Content",
  slug: "Slug",
  tags: "Tags",
  categories: "Categories",
};

export function AiChatPanel({
  isOpen,
  onClose,
  currentContent,
  title,
  excerpt,
  locale,
  entityType,
  availableTags,
  availableCategories,
  onApplyFields,
  onSwitchLocale,
}: AiChatPanelProps) {
  const [input, setInput] = useState("");
  const [autoApply, setAutoApply] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
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
  } = useAiStream({ entityType, locale });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamedText]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  useEffect(() => {
    if (pendingUpdate && autoApply) {
      handleApplyUpdate(pendingUpdate);
    }
  }, [pendingUpdate, autoApply]);

  const getSystemPrompt = () => {
    return buildSystemPrompt(
      entityType,
      locale,
      title,
      excerpt || "",
      currentContent,
      availableTags,
      availableCategories
    );
  };

  const handleSend = async (prefix?: string) => {
    const message = input.trim();
    if (!message && !prefix) return;
    if (isGenerating) return;

    const fullMessage = prefix ? `${prefix} ${message}` : message;

    setInput("");
    await sendMessage(fullMessage, getSystemPrompt());
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
    clearPendingUpdate();
  };

  const handleDiscardUpdate = () => {
    clearPendingUpdate();
  };

  const getFieldList = (fields: AiFieldUpdates): string[] => {
    return Object.entries(fields)
      .filter(([, v]) => v !== undefined && v !== null && v !== "")
      .map(([k]) => FIELD_LABELS[k] || k);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div
        className="w-96 h-full bg-background border-l shadow-xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
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
            <Button variant="ghost" size="icon-xs" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && !streamedText && (
            <div className="text-center text-muted-foreground py-8">
              <Bot className="h-8 w-8 mx-auto mb-3 opacity-50" />
              <p className="text-sm">AI Content Agent</p>
              <p className="text-xs mt-1">
                Write, edit, translate, and optimize your content.
              </p>
              <p className="text-xs mt-2 text-muted-foreground/70">
                Just describe what you need — I&apos;ll figure out the rest.
              </p>
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
                <div className="whitespace-pre-wrap break-words text-xs leading-relaxed">
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
          <div className="mx-3 mb-2 rounded-lg border border-primary/30 bg-primary/5 p-3">
            <div className="flex items-center gap-2 mb-2">
              <Check className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium">
                AI prepared updates for:{" "}
                {getFieldList(pendingUpdate.fields).join(", ")}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mb-2">
              Target: <strong>{pendingUpdate.locale === "en" ? "English" : "Arabic"}</strong> section
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => handleApplyUpdate(pendingUpdate)}
                className="h-7 text-xs"
              >
                <Check className="h-3 w-3 me-1" />
                Apply to {pendingUpdate.locale === "en" ? "EN" : "AR"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDiscardUpdate}
                className="h-7 text-xs"
              >
                <XCircle className="h-3 w-3 me-1" />
                Discard
              </Button>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t p-3">
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
              disabled={isGenerating || !input.trim()}
            >
              <FileText className="h-3 w-3 me-1" />
              Plan
            </Button>
            <Button
              size="sm"
              className="flex-1 h-8 text-xs"
              onClick={handleBuild}
              disabled={isGenerating || !input.trim()}
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
              Auto-apply updates
            </label>
            {messages.some((m) => m.role === "assistant") && (
              <button
                onClick={() => {
                  const last = [...messages].reverse().find((m) => m.role === "assistant");
                  if (last) navigator.clipboard.writeText(last.cleanContent || last.content);
                }}
                className="text-[10px] text-muted-foreground hover:text-foreground"
              >
                Copy last
              </button>
            )}
          </div>
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
        <div className="whitespace-pre-wrap break-words text-xs leading-relaxed">
          {message.cleanContent || message.content}
        </div>
        {message.pendingUpdate && (
          <Badge variant="outline" className="text-[9px] mt-1">
            Has updates for {message.pendingUpdate.locale === "en" ? "EN" : "AR"}
          </Badge>
        )}
      </div>
    </div>
  );
}
