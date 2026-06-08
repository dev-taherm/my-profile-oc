"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
interface ContactFormProps {
  dict: {
    contact: {
      form: {
        name: string;
        email: string;
        subject: string;
        message: string;
        send: string;
        sending: string;
        success: string;
        error: string;
      };
    };
  };
}

export function ContactForm({ dict }: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <Input
          placeholder={dict.contact.form.name}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <Input
          type="email"
          placeholder={dict.contact.form.email}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>
      <Input
        placeholder={dict.contact.form.subject}
        value={formData.subject}
        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
      />
      <Textarea
        placeholder={dict.contact.form.message}
        rows={5}
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        required
      />
      <Button type="submit" disabled={status === "sending"} className="w-full">
        <Send className="me-2 h-4 w-4" />
        {status === "sending" ? dict.contact.form.sending : dict.contact.form.send}
      </Button>
      {status === "success" && (
        <p className="text-sm text-green-600 dark:text-green-400">{dict.contact.form.success}</p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-600 dark:text-red-400">{dict.contact.form.error}</p>
      )}
    </form>
  );
}
