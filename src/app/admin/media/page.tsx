"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Upload,
  Search,
  Trash2,
  FileText,
  ImageIcon,
  Copy,
  ExternalLink,
  FolderOpen,
  FolderPlus,
  ChevronRight,
  Check,
  X,
  Folder as FolderIcon,
  MoreVertical,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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

export default function AdminMediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadTotal, setUploadTotal] = useState(0);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeFolder, setActiveFolder] = useState<string | null | undefined>(undefined);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [editFolderName, setEditFolderName] = useState("");
  const [folderMenu, setFolderMenu] = useState<string | null>(null);
  const [moveMenuOpen, setMoveMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = useCallback(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (activeFolder !== undefined) {
      if (activeFolder === null) params.set("folderId", "null");
      else if (activeFolder) params.set("folderId", activeFolder);
    }
    const res = await fetch(`/api/media?${params}`);
    if (res.ok) setMedia(await res.json());
  }, [search, activeFolder]);

  const fetchFolders = useCallback(async () => {
    const res = await fetch("/api/media/folders");
    if (res.ok) setFolders(await res.json());
  }, []);

  useEffect(() => { fetchMedia(); }, [fetchMedia]);
  useEffect(() => { fetchFolders(); }, [fetchFolders]);

  const handleUpload = async (files: FileList | File[], folderId?: string | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);
    setUploadTotal(files.length);

    const targetFolder = folderId !== undefined ? folderId : activeFolder;

    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append("file", files[i]);
      if (targetFolder) formData.append("folderId", targetFolder);

      try {
        const res = await fetch("/api/media", { method: "POST", body: formData });
        if (res.ok) {
          const { media: uploaded } = await res.json();
          if (uploaded?.length) {
            setMedia((prev) => [uploaded[0], ...prev]);
          }
        }
      } catch {
        // continue with next file
      }
      setUploadProgress(i + 1);
    }

    setUploading(false);
    setUploadProgress(0);
    setUploadTotal(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleUpload(files);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) handleUpload(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this file?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/media?id=${id}`, { method: "DELETE" });
      if (res.ok) setMedia((prev) => prev.filter((m) => m.id !== id));
    } finally {
      setDeleting(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} file(s)?`)) return;

    const ids = Array.from(selectedIds);
    const res = await fetch(`/api/media?ids=${ids.join(",")}`, { method: "DELETE" });
    if (res.ok) {
      setMedia((prev) => prev.filter((m) => !selectedIds.has(m.id)));
      setSelectedIds(new Set());
    }
  };

  const handleBulkMove = async (folderId: string | null) => {
    if (selectedIds.size === 0) return;

    const res = await fetch("/api/media/move", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mediaIds: Array.from(selectedIds), folderId }),
    });
    if (res.ok) {
      setSelectedIds(new Set());
      setMoveMenuOpen(false);
      fetchMedia();
    }
  };

  const handleCopyUrl = (item: MediaItem) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selectedIds.size === media.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(media.map((m) => m.id)));
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    const res = await fetch("/api/media/folders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newFolderName.trim() }),
    });
    if (res.ok) {
      const folder: FolderItem = await res.json();
      setFolders((prev) => [folder, ...prev]);
      setNewFolderName("");
      setShowNewFolder(false);
    }
  };

  const handleRenameFolder = async (id: string) => {
    if (!editFolderName.trim()) return;
    const res = await fetch(`/api/media/folders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editFolderName.trim() }),
    });
    if (res.ok) {
      const folder: FolderItem = await res.json();
      setFolders((prev) => prev.map((f) => (f.id === id ? folder : f)));
      setEditingFolder(null);
      setFolderMenu(null);
    }
  };

  const handleDeleteFolder = async (id: string) => {
    if (!confirm("Delete this folder? Files inside will become folderless.")) return;
    const res = await fetch(`/api/media/folders/${id}`, { method: "DELETE" });
    if (res.ok) {
      setFolders((prev) => prev.filter((f) => f.id !== id));
      if (activeFolder === id) setActiveFolder(undefined);
      setFolderMenu(null);
      fetchMedia();
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const isImage = (mime: string) => mime.startsWith("image/");

  const totalMediaCount = folders.reduce((sum, f) => sum + f._count.media, 0);
  const ungroupedCount = media.length;

  return (
    <div className="flex gap-6 min-h-[calc(100vh-8rem)]">
      {/* Folder Sidebar */}
      <div className="w-52 shrink-0">
        <div className="sticky top-24">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-muted-foreground">Folders</h2>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setShowNewFolder(true)}
              type="button"
            >
              <FolderPlus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-0.5">
            <button
              type="button"
              onClick={() => setActiveFolder(undefined)}
              className={cn(
                "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors text-left",
                activeFolder === undefined
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <FolderOpen className="h-4 w-4 shrink-0" />
              <span className="truncate">All Media</span>
              <span className="ms-auto text-xs opacity-60">{totalMediaCount}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveFolder(null)}
              className={cn(
                "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors text-left",
                activeFolder === null
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <FolderIcon className="h-4 w-4 shrink-0" />
              <span className="truncate">Ungrouped</span>
              <span className="ms-auto text-xs opacity-60">{ungroupedCount}</span>
            </button>

            {folders.map((folder) => (
              <div key={folder.id} className="relative group">
                {editingFolder === folder.id ? (
                  <div className="flex items-center gap-1 px-2">
                    <Input
                      value={editFolderName}
                      onChange={(e) => setEditFolderName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleRenameFolder(folder.id);
                        if (e.key === "Escape") setEditingFolder(null);
                      }}
                      className="h-7 text-sm"
                      autoFocus
                    />
                  </div>
                ) : (
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setActiveFolder(folder.id)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setActiveFolder(folder.id); }}
                    className={cn(
                      "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors text-left cursor-pointer",
                      activeFolder === folder.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <FolderIcon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{folder.name}</span>
                    <span className="ms-auto text-xs opacity-60">{folder._count.media}</span>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFolderMenu(folderMenu === folder.id ? null : folder.id);
                        }}
                        className="p-0.5 rounded hover:bg-muted-foreground/20 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="h-3 w-3" />
                      </button>
                      {folderMenu === folder.id && (
                        <div className="absolute end-0 top-full z-10 mt-1 w-32 rounded-md border bg-popover shadow-md">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingFolder(folder.id);
                              setEditFolderName(folder.name);
                              setFolderMenu(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-muted"
                          >
                            <Pencil className="h-3 w-3" /> Rename
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteFolder(folder.id)}
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-destructive hover:bg-muted"
                          >
                            <Trash2 className="h-3 w-3" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {showNewFolder && (
              <div className="flex items-center gap-1 px-2">
                <Input
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCreateFolder();
                    if (e.key === "Escape") { setShowNewFolder(false); setNewFolderName(""); }
                  }}
                  onBlur={() => {
                    if (!newFolderName.trim()) { setShowNewFolder(false); setNewFolderName(""); }
                  }}
                  placeholder="Folder name..."
                  className="h-7 text-sm"
                  autoFocus
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Media Library</h1>
            {activeFolder !== undefined && (
              <p className="text-sm text-muted-foreground mt-1">
                {activeFolder === null
                  ? "Ungrouped files"
                  : activeFolder === undefined
                    ? "All files"
                    : folders.find((f) => f.id === activeFolder)?.name || "Folder"}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
              multiple
              onChange={handleFileInput}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              type="button"
            >
              <Upload className="me-2 h-4 w-4" />
              {uploading
                ? `Uploading ${uploadProgress}/${uploadTotal}...`
                : "Upload Files"}
            </Button>
          </div>
        </div>

        {/* Search + Bulk Actions */}
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search media..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchMedia()}
              className="ps-9"
            />
          </div>

          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{selectedIds.size} selected</span>
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMoveMenuOpen(!moveMenuOpen)}
                  type="button"
                >
                  Move to...
                </Button>
                {moveMenuOpen && (
                  <div className="absolute end-0 top-full z-10 mt-1 w-48 rounded-md border bg-popover shadow-md">
                    <button
                      type="button"
                      onClick={() => handleBulkMove(null)}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-muted text-start"
                    >
                      <FolderIcon className="h-4 w-4" /> Ungrouped
                    </button>
                    {folders.map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => handleBulkMove(f.id)}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-muted text-start"
                      >
                        <FolderIcon className="h-4 w-4" /> {f.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
                type="button"
              >
                <Trash2 className="h-4 w-4 me-1" /> Delete
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedIds(new Set())}
                type="button"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Drag & Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "rounded-lg transition-colors",
            isDragging && "ring-2 ring-primary ring-offset-2 bg-primary/5"
          )}
        >
          {media.length === 0 && !uploading ? (
            <Card>
              <CardContent className="py-12 text-center">
                <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-2">
                  {search ? "No media matches your search." : "No media files yet."}
                </p>
                <p className="text-sm text-muted-foreground/70">
                  Drag & drop files here or click &quot;Upload Files&quot;.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Select All */}
              <div className="flex items-center gap-2 mb-2">
                <button
                  type="button"
                  onClick={selectAll}
                  className={cn(
                    "flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  )}
                >
                  <div
                    className={cn(
                      "h-4 w-4 rounded border flex items-center justify-center",
                      selectedIds.size === media.length && media.length > 0
                        ? "bg-primary border-primary text-primary-foreground"
                        : "border-muted-foreground/40"
                    )}
                  >
                    {selectedIds.size === media.length && media.length > 0 && (
                      <Check className="h-3 w-3" />
                    )}
                  </div>
                  Select all
                </button>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {media.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      "group relative rounded-lg border overflow-hidden",
                      selectedIds.has(item.id) && "ring-2 ring-primary"
                    )}
                  >
                    {/* Checkbox */}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); toggleSelect(item.id); }}
                      className="absolute top-2 left-2 z-10"
                    >
                      <div
                        className={cn(
                          "h-5 w-5 rounded border flex items-center justify-center transition-colors",
                          selectedIds.has(item.id)
                            ? "bg-primary border-primary text-primary-foreground"
                            : "bg-black/30 border-white/50 opacity-0 group-hover:opacity-100"
                        )}
                      >
                        {selectedIds.has(item.id) && <Check className="h-3 w-3" />}
                      </div>
                    </button>

                    {isImage(item.mimeType) ? (
                      <div className="aspect-square">
                        <img
                          src={item.url}
                          alt={item.alt || item.filename}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-square flex flex-col items-center justify-center bg-muted/50 p-4">
                        <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                        <span className="text-xs text-muted-foreground text-center break-all line-clamp-2">
                          {item.filename}
                        </span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        size="icon-sm"
                        variant="secondary"
                        onClick={() => handleCopyUrl(item)}
                        type="button"
                      >
                        {copiedId === item.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="icon-sm"
                        variant="secondary"
                        render={
                          <a href={item.url} target="_blank" rel="noopener noreferrer" />
                        }
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon-sm"
                        variant="destructive"
                        onClick={() => handleDelete(item.id)}
                        disabled={deleting === item.id}
                        type="button"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="p-2">
                      <p className="text-xs truncate text-muted-foreground">
                        {item.alt || item.filename}
                      </p>
                      <p className="text-[10px] text-muted-foreground/70">
                        {formatSize(item.size)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
