"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TaxonomyItem {
  id: string;
  name: string;
}

interface InlineTaxonomyCreatorProps {
  type: "category" | "tag";
  items: TaxonomyItem[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onCreated: (item: TaxonomyItem) => void;
}

export function InlineTaxonomyCreator({
  type,
  items,
  selectedIds,
  onToggle,
  onCreated,
}: InlineTaxonomyCreatorProps) {
  const [showInput, setShowInput] = useState(false);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const endpoint = type === "category" ? "/api/categories" : "/api/tags";

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    setError("");

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error || "Failed to create");
        return;
      }

      const item = await res.json();
      onCreated(item);
      setNewName("");
      setShowInput(false);
    } catch {
      setError("Failed to create");
    } finally {
      setCreating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCreate();
    } else if (e.key === "Escape") {
      setShowInput(false);
      setNewName("");
      setError("");
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <label
            key={item.id}
            className="flex items-center gap-1.5 text-sm border rounded-md px-3 py-1.5 cursor-pointer hover:bg-accent"
          >
            <input
              type="checkbox"
              checked={selectedIds.includes(item.id)}
              onChange={() => onToggle(item.id)}
            />
            {item.name}
          </label>
        ))}
        {items.length === 0 && !showInput && (
          <p className="text-sm text-muted-foreground">No {type}s available</p>
        )}

        {showInput ? (
          <div className="flex items-center gap-1">
            <Input
              placeholder={type === "category" ? "Category name" : "Tag name"}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-8 w-40 text-sm"
              autoFocus
            />
            <Button
              size="sm"
              onClick={handleCreate}
              disabled={creating || !newName.trim()}
              type="button"
            >
              {creating ? "..." : "Add"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => { setShowInput(false); setNewName(""); setError(""); }}
              type="button"
            >
              ×
            </Button>
          </div>
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowInput(true)}
            type="button"
            className="h-8"
          >
            <Plus className="h-3 w-3 me-1" />
            New {type}
          </Button>
        )}
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
