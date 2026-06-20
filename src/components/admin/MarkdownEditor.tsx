"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { MediaPicker } from "@/components/admin/MediaPicker";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
  dir?: "ltr" | "rtl";
}

export function MarkdownEditor({
  value,
  onChange,
  height = 300,
  dir = "ltr",
}: MarkdownEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  const handleInsertImage = (url: string) => {
    const imageMarkdown = `![image](${url})`;
    onChange(value ? `${value}\n\n${imageMarkdown}` : imageMarkdown);
  };

  return (
    <div ref={editorRef} data-color-mode="dark">
      <div data-color-mode="dark">
        <MDEditor
          value={value}
          onChange={(val) => onChange(val || "")}
          height={height}
          preview="live"
          visibleDragbar={true}
          dir={dir}
        />
      </div>
      <div className="flex items-center gap-2 mt-2">
        <MediaPicker
          accept="image"
          onSelect={handleInsertImage}
          trigger={
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground border rounded-md px-3 py-1.5 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
              Insert Image from Media
            </button>
          }
        />
      </div>
    </div>
  );
}
