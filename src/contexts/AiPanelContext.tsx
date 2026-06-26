"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { AiFieldUpdates } from "@/lib/ai-providers";

interface AiPanelData {
  currentContent: string;
  title: string;
  excerpt: string;
  locale: string;
  entityType: "blog" | "project";
  availableTags: string;
  availableCategories: string;
  onApplyFields: (fields: AiFieldUpdates, targetLocale: "en" | "ar") => void;
  onSwitchLocale?: (locale: "en" | "ar") => void;
}

interface AiPanelContextValue {
  isOpen: boolean;
  panelData: AiPanelData | null;
  openPanel: (data: AiPanelData) => void;
  closePanel: () => void;
}

const AiPanelContext = createContext<AiPanelContextValue | null>(null);

export function AiPanelProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [panelData, setPanelData] = useState<AiPanelData | null>(null);

  const openPanel = useCallback((data: AiPanelData) => {
    setPanelData(data);
    setIsOpen(true);
  }, []);

  const closePanel = useCallback(() => {
    setIsOpen(false);
    setPanelData(null);
  }, []);

  return (
    <AiPanelContext.Provider value={{ isOpen, panelData, openPanel, closePanel }}>
      {children}
    </AiPanelContext.Provider>
  );
}

export function useAiPanel() {
  const ctx = useContext(AiPanelContext);
  if (!ctx) throw new Error("useAiPanel must be used within AiPanelProvider");
  return ctx;
}
