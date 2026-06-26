"use client";

import { useState, useRef, useCallback } from "react";

interface UseAiStreamOptions {
  entityType?: "blog" | "project";
  locale?: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export function useAiStream(options: UseAiStreamOptions = {}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamedText, setStreamedText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const stopGeneration = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setIsGenerating(false);
  }, []);

  const sendMessage = useCallback(
    async (
      prompt: string,
      systemPrompt?: string,
      onChunk?: (text: string) => void
    ): Promise<string | null> => {
      setError(null);
      setIsGenerating(true);
      setStreamedText("");

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

        setMessages((prev) => [...prev, { role: "assistant", content: fullText }]);
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
    [options.entityType, options.locale]
  );

  const clearChat = useCallback(() => {
    setMessages([]);
    setStreamedText("");
    setError(null);
  }, []);

  return {
    isGenerating,
    streamedText,
    messages,
    error,
    sendMessage,
    stopGeneration,
    clearChat,
  };
}

export type { ChatMessage };
