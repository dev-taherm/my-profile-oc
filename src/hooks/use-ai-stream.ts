"use client";

import { useState, useRef, useCallback } from "react";
import { parseAiUpdate, type AiPendingUpdate } from "@/lib/ai-providers";

interface UseAiStreamOptions {
  entityType?: "blog" | "project";
  locale?: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  cleanContent?: string;
  pendingUpdate?: AiPendingUpdate;
}

export function useAiStream(options: UseAiStreamOptions = {}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamedText, setStreamedText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<string | null>(null);
  const [pendingUpdate, setPendingUpdate] = useState<AiPendingUpdate | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const stopGeneration = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setIsGenerating(false);
  }, []);

  const searchWeb = useCallback(
    async (query: string): Promise<string | null> => {
      try {
        const res = await fetch("/api/ai/web-search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, maxResults: 5 }),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || `Search failed (${res.status})`);
        }

        const data = await res.json();
        const resultsText = data.results
          ?.map(
            (r: { title: string; url: string; content: string; score: number }, i: number) =>
              `${i + 1}. **${r.title}**\n   ${r.url}\n   ${r.content}\n   (relevance: ${(r.score * 100).toFixed(0)}%)`
          )
          .join("\n\n");

        const fullText = data.answer
          ? `**AI Summary:** ${data.answer}\n\n**Search Results:**\n${resultsText || "(none)"}`
          : `**Search Results:**\n${resultsText || "(none)"}`;

        setSearchResults(fullText);
        return fullText;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Search failed";
        setError(msg);
        return null;
      }
    },
    []
  );

  const sendMessage = useCallback(
    async (
      prompt: string,
      systemPrompt?: string,
      onChunk?: (text: string) => void
    ): Promise<string | null> => {
      setError(null);
      setIsGenerating(true);
      setStreamedText("");
      setPendingUpdate(null);

      setMessages((prev) => [...prev, { role: "user", content: prompt }]);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const res = await fetch("/api/ai/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt,
            systemPrompt,
            entityType: options.entityType || "blog",
            locale: options.locale || "en",
            chatHistory: messages.slice(-10).map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || `Request failed (${res.status})`);
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No response stream");

        const decoder = new TextDecoder();
        let fullText = "";
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6).trim();
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                fullText += parsed.text;
                setStreamedText(fullText);
                onChunk?.(parsed.text);
              }
            } catch {
              // skip malformed chunks
            }
          }
        }

        // Parse <ai-update> tags from the response
        const { cleanText, update } = parseAiUpdate(fullText);

        if (update) {
          setPendingUpdate(update);
        }

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: fullText,
            cleanContent: cleanText,
            pendingUpdate: update || undefined,
          },
        ]);

        setIsGenerating(false);
        setStreamedText("");
        return fullText;
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          setIsGenerating(false);
          setStreamedText("");
          return null;
        }
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        setIsGenerating(false);
        setStreamedText("");
        return null;
      } finally {
        abortControllerRef.current = null;
      }
    },
    [options.entityType, options.locale, messages, searchWeb]
  );

  const clearPendingUpdate = useCallback(() => {
    setPendingUpdate(null);
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    setStreamedText("");
    setError(null);
    setSearchResults(null);
    setPendingUpdate(null);
  }, []);

  return {
    isGenerating,
    streamedText,
    messages,
    error,
    searchResults,
    pendingUpdate,
    sendMessage,
    stopGeneration,
    clearPendingUpdate,
    clearChat,
    searchWeb,
  };
}

export type { ChatMessage };
