"use client";

import { useState, useRef, useEffect } from "react";
import {
  X,
  Send,
  Bot,
  User,
  Loader2,
  Trash2,
  Sparkles,
  Languages,
  PenLine,
  CheckCircle,
  Wand2,
  ArrowDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAiStream, type ChatMessage } from "@/hooks/use-ai-stream";

interface AiChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentContent: string;
  title: string;
  excerpt?: string;
  locale: string;
  entityType: "blog" | "project";
  onApplyContent: (content: string) => void;
  onApplyTitle?: (title: string) => void;
  onApplyExcerpt?: (excerpt: string) => void;
}

type QuickMode =
  | "chat"
  | "write"
  | "improve"
  | "grammar"
  | "translate-en"
  | "translate-ar"
  | "continue"
  | "summarize";

const QUICK_ACTIONS: { mode: QuickMode; label: string; icon: typeof Sparkles }[] = [
  { mode: "write", label: "Write", icon: PenLine },
  { mode: "improve", label: "Improve", icon: Wand2 },
  { mode: "grammar", label: "Fix Grammar", icon: CheckCircle },
  { mode: "translate-en", label: "To English", icon: Languages },
  { mode: "translate-ar", label: "To Arabic", icon: Languages },
  { mode: "continue", label: "Continue", icon: Sparkles },
  { mode: "summarize", label: "Summarize", icon: Sparkles },
];

function buildPromptForMode(
  mode: QuickMode,
  content: string,
  title: string,
  userMessage: string
): string {
  switch (mode) {
    case "write":
      return `Write a detailed, professional markdown blog post about: "${title}".\n${
        content ? `Current draft/excerpt: ${content}` : ""
      }\nWrite a complete, well-structured article with headings, paragraphs, and code examples where appropriate.`;
    case "improve":
      return `Improve the following markdown content. Make it more professional, well-structured, and engaging. Keep the same language.\n\nTitle: "${title}"\n\nContent:\n${content}`;
    case "grammar":
      return `Fix all grammar, spelling, and punctuation errors in the following markdown content. Only fix errors, do not change the meaning or style.\n\nContent:\n${content}`;
    case "translate-en":
      return `Translate the following content to English. Output ONLY the translated markdown, nothing else.\n\nContent:\n${content}`;
    case "translate-ar":
      return `Translate the following content to Arabic. Output ONLY the translated markdown in Arabic, nothing else.\n\nContent:\n${content}`;
    case "continue":
      return `Continue writing the following markdown content naturally from where it stops. Keep the same style and language.\n\nTitle: "${title}"\n\nContent so far:\n${content}`;
    case "summarize":
      return `Write a brief, compelling excerpt (2-3 sentences) for a blog post titled "${title}" based on this content:\n\n${content}`;
    case "chat":
    default:
      return `You are helping edit a blog post/project.\nTitle: "${title}"\n\nCurrent content:\n${content || "(empty)"}\n\nUser request: ${userMessage}`;
  }
}

function buildSystemPrompt(
  mode: QuickMode,
  entityType: string,
  locale: string
): string {
  const lang = locale === "ar" ? "Arabic" : "English";
  const base = `You are a professional content writer and editor for a portfolio website.
Write in ${lang}. Use markdown formatting. Be concise and professional.
The user is editing a ${entityType}.`;

  switch (mode) {
    case "write":
      return `${base}\nWrite a complete, well-structured article. Use headings (##, ###), short paragraphs, bullet points, and code blocks where relevant.`;
    case "improve":
      return `${base}\nImprove the writing quality, structure, and clarity. Keep the same language and meaning.`;
    case "grammar":
      return `${base}\nFix grammar and spelling errors only. Do not change style or meaning.`;
    case "translate-en":
      return `${base}\nTranslate the content to English. Output ONLY the translated markdown.`;
    case "translate-ar":
      return `${base}\nTranslate the content to Arabic. Output ONLY the translated markdown.`;
    case "continue":
      return `${base}\nContinue writing naturally from where the content stops.`;
    case "summarize":
      return `${base}\nWrite a brief, compelling 2-3 sentence excerpt/summary.`;
    default:
      return `${base}\nRespond with markdown content only. No explanations or meta-commentary.`;
  }
}

export function AiChatPanel({
  isOpen,
  onClose,
  currentContent,
  title,
  locale,
  entityType,
  onApplyContent,
  onApplyTitle,
  onApplyExcerpt,
}: AiChatPanelProps) {
  const [input, setInput] = useState("");
  const [activeMode, setActiveMode] = useState<QuickMode>("chat");
  const [autoApply, setAutoApply] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const {
    isGenerating,
    streamedText,
    messages,
    error,
    sendMessage,
    stopGeneration,
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

  const handleSend = async () => {
    const message = input.trim();
    if (!message && activeMode === "chat") return;
    if (isGenerating) return;

    const prompt = buildPromptForMode(activeMode, currentContent, title, message);
    const systemPrompt = buildSystemPrompt(activeMode, entityType, locale);

    setInput("");
    const result = await sendMessage(prompt, systemPrompt);

    if (result && autoApply) {
      if (activeMode === "summarize" && onApplyExcerpt) {
        onApplyExcerpt(result.trim());
      } else {
        onApplyContent(result);
      }
    }
  };

  const handleQuickAction = async (mode: QuickMode) => {
    if (isGenerating) return;
    setActiveMode(mode);

    const prompt = buildPromptForMode(mode, currentContent, title, "");
    const systemPrompt = buildSystemPrompt(mode, entityType, locale);

    const result = await sendMessage(prompt, systemPrompt);
    if (result) {
      if (mode === "summarize" && onApplyExcerpt) {
        onApplyExcerpt(result.trim());
      } else {
        onApplyContent(result);
      }
    }
    setActiveMode("chat");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopyLast = () => {
    const lastAssistant = [...messages]
      .reverse()
      .find((m) => m.role === "assistant");
    if (lastAssistant) {
      navigator.clipboard.writeText(lastAssistant.content);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="w-80 h-full bg-background border-l shadow-xl flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">AI Assistant</h3>
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

        <div className="px-3 py-2 border-b">
          <p className="text-[11px] text-muted-foreground mb-2">Quick actions:</p>
          <div className="flex flex-wrap gap-1">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.mode}
                  onClick={() => handleQuickAction(action.mode)}
                  disabled={isGenerating}
                  className="inline-flex items-center gap-1 px-2 py-1 text-[11px] rounded-md border hover:bg-muted transition-colors disabled:opacity-50"
                >
                  <Icon className="h-3 w-3" />
                  {action.label}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <label className="flex items-center gap-1.5 text-[11px] text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={autoApply}
                onChange={(e) => setAutoApply(e.target.checked)}
                className="rounded"
              />
              Auto-apply to editor
            </label>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && !streamedText && (
            <div className="text-center text-muted-foreground py-8">
              <Bot className="h-8 w-8 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Ask AI to help write or edit your content.</p>
              <p className="text-xs mt-1">Use quick actions or type a message below.</p>
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

        <div className="border-t p-3">
          <div className="flex gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask AI to write or edit..."
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
                  onClick={handleSend}
                  disabled={!input.trim() && activeMode === "chat"}
                  title="Send"
                >
                  <Send className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-[10px] text-muted-foreground">
              {activeMode !== "chat" && (
                <span>Mode: <strong>{activeMode}</strong> · </span>
              )}
              Press Enter to send, Shift+Enter for new line
            </p>
            {messages.some((m) => m.role === "assistant") && (
              <button
                onClick={handleCopyLast}
                className="text-[10px] text-muted-foreground hover:text-foreground"
              >
                Copy last response
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
          {message.content}
        </div>
      </div>
    </div>
  );
}
