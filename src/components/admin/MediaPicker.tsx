"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Upload, Search, FileText, Check, ImageIcon, FolderIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface MediaItem {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  alt: string | null;
  folderId: string | null;
  folder: { id: string; name: string } | null;
  createdAt: string;
}

interface FolderItem {
  id: string;
  name: string;
  slug: string;
  _count: { media: number };
}

interface MediaPickerProps {
  onSelect: (url: string) => void;
  onMultiSelect?: (urls: string[]) => void;
  trigger?: React.ReactElement;
  accept?: "image" | "document" | "all";
  multiple?: boolean;
}

export function MediaPicker({
  onSelect,
  onMultiSelect,
  trigger,
  accept = "all",
  multiple = false,
}: MediaPickerProps) {
  const [open, setOpen] = useState(false);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [search, setSearch] = useState("");
  const [activeFolder, setActiveFolder] = useState<string | null | undefined>(undefined);
  const [uploading, setUploading] = useState(false);
  const [selectedUrls, setSelectedUrls] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = useCallback(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (accept === "image") params.set("mimeType", "image");
    if (accept === "document") params.set("mimeType", "application");
    if (activeFolder !== undefined) {
      if (activeFolder === null) params.set("folderId", "null");
      else if (activeFolder) params.set("folderId", activeFolder);
    }
    const res = await fetch(`/api/media?${params}`);
    if (res.ok) setMedia(await res.json());
  }, [search, accept, activeFolder]);

  const fetchFolders = useCallback(async () => {
    const res = await fetch("/api/media/folders");
    if (res.ok) setFolders(await res.json());
  }, []);

  useEffect(() => {
    if (open) {
      fetchMedia();
      fetchFolders();
      setSelectedUrls(new Set());
      setActiveFolder(undefined);
    }
  }, [open, fetchMedia, fetchFolders]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append("file", files[i]);
      const res = await fetch("/api/media", { method: "POST", body: formData });
      if (res.ok) {
        const { media: uploaded } = await res.json();
        if (uploaded?.length) {
          setMedia((prev) => [uploaded[0], ...prev]);
          if (!multiple) setSelectedUrls(new Set([uploaded[0].url]));
        }
      }
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const toggleSelect = (url: string) => {
    if (!multiple) {
      setSelectedUrls(new Set([url]));
      return;
    }
    setSelectedUrls((prev) => {
      const next = new Set(prev);
      if (next.has(url)) next.delete(url);
      else next.add(url);
      return next;
    });
  };

  const handleConfirm = () => {
    const urls = Array.from(selectedUrls);
    if (urls.length === 0) return;
    if (multiple && onMultiSelect) {
      onMultiSelect(urls);
    } else {
      onSelect(urls[0]);
    }
    setOpen(false);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const isImage = (mime: string) => mime.startsWith("image/");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          trigger || (
            <Button variant="outline" type="button" />
          )
        }
      >
        <ImageIcon className="me-2 h-4 w-4" />
        {multiple ? "Choose from Media" : "Choose from Media"}
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Media Library</DialogTitle>
        </DialogHeader>

        <div className="flex gap-3">
          {/* Folder sidebar */}
          {folders.length > 0 && (
            <div className="w-36 shrink-0 space-y-0.5">
              <button
                type="button"
                onClick={() => setActiveFolder(undefined)}
                className={cn(
                  "w-full flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors text-start",
                  activeFolder === undefined
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setActiveFolder(null)}
                className={cn(
                  "w-full flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors text-start",
                  activeFolder === null
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                <FolderIcon className="h-3 w-3" /> Ungrouped
              </button>
              {folders.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setActiveFolder(f.id)}
                  className={cn(
                    "w-full flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors text-start truncate",
                    activeFolder === f.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <FolderIcon className="h-3 w-3 shrink-0" />
                  <span className="truncate">{f.name}</span>
                </button>
              ))}
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search files..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="ps-9"
                />
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple={multiple}
                accept={accept === "image" ? "image/*" : accept === "document" ? "application/pdf" : undefined}
                onChange={handleUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                type="button"
              >
                <Upload className="me-2 h-4 w-4" />
                {uploading ? "Uploading..." : "Upload"}
              </Button>
            </div>

            <div className="max-h-72 overflow-y-auto">
              {media.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No media files yet. Upload one to get started.
                </p>
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  {media.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleSelect(item.url)}
                      className={cn(
                        "relative group rounded-md border-2 overflow-hidden aspect-square",
                        selectedUrls.has(item.url)
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-transparent hover:border-muted-foreground/30"
                      )}
                    >
                      {isImage(item.mimeType) ? (
                        <img
                          src={item.url}
                          alt={item.alt || item.filename}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-muted/50">
                          <FileText className="h-8 w-8 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground mt-1 px-1 text-center truncate max-w-full">
                            {item.filename}
                          </span>
                        </div>
                      )}
                      {selectedUrls.has(item.url) && (
                        <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-0.5">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                      <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] px-1 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity truncate">
                        {formatSize(item.size)}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-2">
          <Button variant="outline" onClick={() => setOpen(false)} type="button">
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={selectedUrls.size === 0}
            type="button"
          >
            Select {selectedUrls.size > 0 && `(${selectedUrls.size})`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
