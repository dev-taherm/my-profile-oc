"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Tag {
  id: string;
  slug: string;
  name: string;
}

const initialTags: Tag[] = [
  { id: "1", slug: "python", name: "Python" },
  { id: "2", slug: "django", name: "Django" },
  { id: "3", slug: "fastapi", name: "FastAPI" },
  { id: "4", slug: "postgresql", name: "PostgreSQL" },
  { id: "5", slug: "docker", name: "Docker" },
  { id: "6", slug: "aws", name: "AWS" },
  { id: "7", slug: "react", name: "React" },
  { id: "8", slug: "nextjs", name: "Next.js" },
  { id: "9", slug: "langchain", name: "LangChain" },
  { id: "10", slug: "rag", name: "RAG" },
  { id: "11", slug: "microservices", name: "Microservices" },
  { id: "12", slug: "typescript", name: "TypeScript" },
];

export default function AdminTagsPage() {
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [name, setName] = useState("");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Tags</h1>

      <div className="flex gap-3 mb-6">
        <Input
          placeholder="Tag name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => { if (name) { setTags([...tags, { id: Date.now().toString(), slug: name.toLowerCase().replace(/\s+/g, "-"), name }]); setName(""); } }}>
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
            {tags.map((tag) => (
              <TableRow key={tag.id}>
                <TableCell className="font-medium">{tag.name}</TableCell>
                <TableCell>{tag.slug}</TableCell>
                <TableCell className="text-end">
                  <Button variant="ghost" size="icon" onClick={() => setTags(tags.filter((t) => t.id !== tag.id))}>
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
