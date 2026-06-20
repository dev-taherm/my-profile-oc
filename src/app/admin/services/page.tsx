"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Service {
  id: string;
  slug: string;
  icon: string | null;
  featured: boolean;
  status: string;
  translations: { locale: string; title: string }[];
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    fetch("/api/services").then((r) => r.json()).then(setServices);
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    await fetch(`/api/services?id=${id}`, { method: "DELETE" });
    setServices(services.filter((s) => s.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Services</h1>
        <Button render={<Link href="/admin/services/new" />}>
          <Plus className="me-2 h-4 w-4" />
          New Service
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Icon</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="text-end">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => {
              const t = service.translations.find((tr) => tr.locale === "en") || service.translations[0];
              return (
                <TableRow key={service.id}>
                  <TableCell>
                    <span className="text-muted-foreground text-xs">{service.icon || "—"}</span>
                  </TableCell>
                  <TableCell className="font-medium">{t?.title || "—"}</TableCell>
                  <TableCell>
                    <Badge variant={service.status === "PUBLISHED" ? "default" : "secondary"}>
                      {service.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{service.featured ? "Yes" : "No"}</TableCell>
                  <TableCell className="text-end">
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" size="icon" render={<Link href={`/admin/services/${service.id}`} />}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(service.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {services.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No services yet. Create your first one.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
