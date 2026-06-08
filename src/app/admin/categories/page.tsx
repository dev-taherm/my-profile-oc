"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Category {
  id: string;
  slug: string;
  name: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then(() => {
        // Categories are embedded in projects; for now use static
        setCategories([
          { id: "1", slug: "backend", name: "Backend" },
          { id: "2", slug: "ai-llm", name: "AI / LLM" },
          { id: "3", slug: "full-stack", name: "Full-Stack" },
          { id: "4", slug: "devops", name: "DevOps" },
        ]);
      });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Categories</h1>

      <div className="flex gap-3 mb-6">
        <Input
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => { if (name) { setCategories([...categories, { id: Date.now().toString(), slug: name.toLowerCase().replace(/\s+/g, "-"), name }]); setName(""); } }}>
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
              <TableHead className="text-end">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell className="font-medium">{cat.name}</TableCell>
                <TableCell>{cat.slug}</TableCell>
                <TableCell className="text-end">
                  <Button variant="ghost" size="icon" onClick={() => setCategories(categories.filter((c) => c.id !== cat.id))}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
