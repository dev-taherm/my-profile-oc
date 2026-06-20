"use client";

import { useEffect, useState, useRef } from "react";
import { Upload, FileText, Trash2, Save, User, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function AdminSettingsPage() {
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");

  useEffect(() => {
    fetch("/api/user/profile")
      .then((r) => r.json())
      .then((user) => {
        if (user) {
          if (user.resumeUrl) setResumeUrl(user.resumeUrl);
          if (user.name) setName(user.name);
          if (user.email) setEmail(user.email);
        }
      });
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload?type=resume", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error || "Upload failed");
        return;
      }

      const { url } = await res.json();

      const saveRes = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeUrl: url }),
      });

      if (!saveRes.ok) {
        setError("Failed to save resume URL");
        return;
      }

      setResumeUrl(url);
      setSuccess("Resume uploaded successfully!");
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async () => {
    if (!confirm("Remove the current resume?")) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeUrl: null }),
      });

      if (!res.ok) {
        setError("Failed to remove resume");
        return;
      }

      setResumeUrl(null);
      setSuccess("Resume removed.");
    } catch {
      setError("Failed to remove resume");
    } finally {
      setSaving(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileError("");
    setProfileSuccess("");

    try {
      const body: { name: string; email: string; password?: string } = { name, email };
      if (password) body.password = password;

      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setProfileError(data.error || "Failed to update profile");
        return;
      }

      setProfileSuccess("Profile updated successfully!");
      setPassword("");
    } catch {
      setProfileError("Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Name
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave blank to keep current"
                minLength={6}
              />
              <p className="text-xs text-muted-foreground">Leave blank to keep your current password. Minimum 6 characters.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button type="submit" disabled={savingProfile}>
                <Save className="me-2 h-4 w-4" />
                {savingProfile ? "Saving..." : "Save Profile"}
              </Button>
              {profileError && <p className="text-sm text-red-500">{profileError}</p>}
              {profileSuccess && <p className="text-sm text-green-500">{profileSuccess}</p>}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Resume / CV</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Upload your resume PDF. Visitors can download it from the Resume page.
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleUpload}
            className="hidden"
          />

          {resumeUrl ? (
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <FileText className="h-8 w-8 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">Current Resume</p>
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  {resumeUrl.split("/").pop()}
                </a>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                disabled={saving}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ) : (
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-3">No resume uploaded</p>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <Upload className="me-2 h-4 w-4" />
                {uploading ? "Uploading..." : "Upload Resume PDF"}
              </Button>
            </div>
          )}

          {resumeUrl && (
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <Upload className="me-2 h-4 w-4" />
              {uploading ? "Uploading..." : "Replace Resume"}
            </Button>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-green-500">{success}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
