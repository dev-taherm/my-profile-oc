"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Tag {
  id: string;
  slug: string;
  name: string;
  _count: { projects: number; blogPosts: number };
}

export default function AdminTagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchTags = () => {
    fetch("/api/tags")
      .then((r) => r.json())
      .then(setTags);
  };

  useEffect(() => { fetchTags(); }, []);

  const handleAdd = async () => {
    if (!name.trim() || loading) return;
    setLoading(true);
    const res = await fetch("/api/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (res.ok) {
      setName("");
      fetchTags();
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/tags?id=${id}`, { method: "DELETE" });
    fetchTags();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Tags</h1>

      <div className="flex gap-3 mb-6">
        <Input
          placeholder="Tag name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          className="max-w-sm"
        />
        <Button onClick={handleAdd} disabled={loading}>
          <Plus className="me-2 h-4 w-4" />
          Add
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="text-center">Projects</TableHead>
              <TableHead className="text-center">Blog Posts</TableHead>
              <TableHead className="text-end">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tags.map((tag) => (
              <TableRow key={tag.id}>
                <TableCell className="font-medium">{tag.name}</TableCell>
                <TableCell>{tag.slug}</TableCell>
                <TableCell className="text-center">{tag._count.projects}</TableCell>
                <TableCell className="text-center">{tag._count.blogPosts}</TableCell>
                <TableCell className="text-end">
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(tag.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {tags.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">No tags yet</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
