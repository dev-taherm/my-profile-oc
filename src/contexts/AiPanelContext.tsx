"use client";

import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from "react";
import type { AiFieldUpdates } from "@/lib/ai-providers";

interface AiPanelData {
  currentContent: string;
  title: string;
  excerpt: string;
  locale: string;
  entityType: "blog" | "project";
  availableTags: string;
  availableCategories: string;
  existingArticles?: string;
}

interface AiPanelContextValue {
  isOpen: boolean;
  panelData: AiPanelData | null;
  openPanel: (data: AiPanelData) => void;
  updatePanelData: (updates: Partial<AiPanelData>) => void;
  closePanel: () => void;
  registerApplyHandler: (handler: (fields: AiFieldUpdates, targetLocale: "en" | "ar") => void) => void;
  registerSwitchLocaleHandler: (handler: (locale: "en" | "ar") => void) => void;
  applyHandlerRef: React.MutableRefObject<((fields: AiFieldUpdates, targetLocale: "en" | "ar") => void) | null>;
  switchLocaleHandlerRef: React.MutableRefObject<((locale: "en" | "ar") => void) | null>;
}

const AiPanelContext = createContext<AiPanelContextValue | null>(null);

export function AiPanelProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [panelData, setPanelData] = useState<AiPanelData | null>(null);
  const applyHandlerRef = useRef<((fields: AiFieldUpdates, targetLocale: "en" | "ar") => void) | null>(null);
  const switchLocaleHandlerRef = useRef<((locale: "en" | "ar") => void) | null>(null);

  const openPanel = useCallback((data: AiPanelData) => {
    setPanelData(data);
    setIsOpen(true);
  }, []);

  const updatePanelData = useCallback((updates: Partial<AiPanelData>) => {
    setPanelData((prev) => (prev ? { ...prev, ...updates } : null));
  }, []);

  const closePanel = useCallback(() => {
    setIsOpen(false);
    setPanelData(null);
  }, []);

  const registerApplyHandler = useCallback((handler: (fields: AiFieldUpdates, targetLocale: "en" | "ar") => void) => {
    applyHandlerRef.current = handler;
  }, []);

  const registerSwitchLocaleHandler = useCallback((handler: (locale: "en" | "ar") => void) => {
    switchLocaleHandlerRef.current = handler;
  }, []);

  return (
    <AiPanelContext.Provider value={{ isOpen, panelData, openPanel, updatePanelData, closePanel, registerApplyHandler, registerSwitchLocaleHandler, applyHandlerRef, switchLocaleHandlerRef }}>
      {children}
    </AiPanelContext.Provider>
  );
}

export function useAiPanel() {
  const ctx = useContext(AiPanelContext);
  if (!ctx) throw new Error("useAiPanel must be used within AiPanelProvider");
  return ctx;
}
