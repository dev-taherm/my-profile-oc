"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface BlogPost {
  id: string;
  slug: string;
  status: string;
  featured: boolean;
  readingTime: number;
  translations: { locale: string; title: string }[];
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    fetch("/api/blog").then((r) => r.json()).then(setPosts);
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    await fetch(`/api/blog?id=${id}`, { method: "DELETE" });
    setPosts(posts.filter((p) => p.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Blog Posts</h1>
        <Button render={<Link href="/admin/blog/new" />}>
          <Plus className="me-2 h-4 w-4" />
          New Post
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Read Time</TableHead>
              <TableHead className="text-end">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => {
              const t = post.translations.find((tr) => tr.locale === "en") || post.translations[0];
              return (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{t?.title || "—"}</TableCell>
                  <TableCell>
                    <Badge variant={post.status === "PUBLISHED" ? "default" : "secondary"}>
                      {post.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{post.readingTime} min</TableCell>
                  <TableCell className="text-end">
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" size="icon" render={<Link href={`/admin/blog/${post.id}`} />}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(post.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
