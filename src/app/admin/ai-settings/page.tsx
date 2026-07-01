"use client";

import { useEffect, useState } from "react";
import {
  Bot, Save, TestTube, CheckCircle, XCircle, Loader2, Search,
  Plus, Trash2, Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type AiProvider = "ollama" | "openai" | "claude" | "google";

interface Profile {
  id: string;
  name: string;
  provider: AiProvider;
  apiKey: string | null;
  apiKeySet: boolean;
  baseUrl: string | null;
  model: string;
  isDefault: boolean;
}

const PROVIDER_INFO: Record<AiProvider, { label: string; defaultBaseUrl: string; models: string[] }> = {
  ollama: {
    label: "Ollama",
    defaultBaseUrl: "http://localhost:11434",
    models: [
      "llama3", "llama3.1", "mistral", "codellama", "phi3", "gemma2",
      "gpt-oss:120b", "gpt-oss:20b", "deepseek-v3.1:671b", "qwen3-coder:480b-cloud",
    ],
  },
  openai: {
    label: "OpenAI-Compatible",
    defaultBaseUrl: "https://api.openai.com/v1",
    models: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-3.5-turbo"],
  },
  claude: {
    label: "Claude (Anthropic)",
    defaultBaseUrl: "https://api.anthropic.com",
    models: ["claude-3-5-sonnet-20241022", "claude-3-haiku-20240307", "claude-3-opus-20240229"],
  },
  google: {
    label: "Google AI Studio",
    defaultBaseUrl: "https://generativelanguage.googleapis.com/v1beta",
    models: ["gemini-2.5-flash", "gemini-2.5-pro", "gemini-3-flash", "gemini-3.5-flash", "gemini-2.5-flash-lite"],
  },
};

export default function AdminAiSettingsPage() {
  // ── Profile list state ──
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loadingProfiles, setLoadingProfiles] = useState(true);

  // ── Edit form state ──
  const [editName, setEditName] = useState("");
  const [editProvider, setEditProvider] = useState<AiProvider>("ollama");
  const [editApiKey, setEditApiKey] = useState("");
  const [editApiKeySet, setEditApiKeySet] = useState(false);
  const [editBaseUrl, setEditBaseUrl] = useState("");
  const [editModel, setEditModel] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // ── UI feedback ──
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);

  // ── Tavily ──
  const [tavilyApiKey, setTavilyApiKey] = useState("");
  const [tavilyKeySet, setTavilyKeySet] = useState(false);
  const [savingTavily, setSavingTavily] = useState(false);
  const [testingSearch, setTestingSearch] = useState(false);
  const [searchTestResult, setSearchTestResult] = useState<{ ok: boolean; message: string } | null>(null);

  // ── Load profiles ──
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/ai/profiles");
        if (!cancelled && res.ok) {
          const data = await res.json();
          setProfiles(data);
        }
      } finally {
        if (!cancelled) setLoadingProfiles(false);
      }
    })();
    (async () => {
      const res = await fetch("/api/ai/settings");
      const data = await res.json();
      if (!cancelled && data.tavilyKeySet) setTavilyKeySet(data.tavilyKeySet);
    })();
    return () => { cancelled = true; };
  }, []);

  // Auto-select first profile after load
  useEffect(() => {
    if (!loadingProfiles && !selectedId && profiles.length > 0) {
      // Defer state update to avoid cascading renders
      const id = requestAnimationFrame(() => setSelectedId(profiles[0].id));
      return () => cancelAnimationFrame(id);
    }
  }, [loadingProfiles, selectedId, profiles]);

  // ── Load selected profile into form ──
  useEffect(() => {
    if (isCreating) return;
    const p = profiles.find((x) => x.id === selectedId);
    const id = requestAnimationFrame(() => {
      if (!p) {
        setEditName("");
        setEditProvider("ollama");
        setEditApiKey("");
        setEditApiKeySet(false);
        setEditBaseUrl(PROVIDER_INFO.ollama.defaultBaseUrl);
        setEditModel(PROVIDER_INFO.ollama.models[0]);
        return;
      }
      setEditName(p.name);
      setEditProvider(p.provider);
      setEditApiKey("");
      setEditApiKeySet(p.apiKeySet);
      setEditBaseUrl(p.baseUrl || PROVIDER_INFO[p.provider].defaultBaseUrl);
      setEditModel(p.model);
    });
    return () => cancelAnimationFrame(id);
  }, [selectedId, profiles, isCreating]);

  // ── New profile ──
  const handleNew = () => {
    setIsCreating(true);
    setSelectedId(null);
    setEditName("");
    setEditProvider("ollama");
    setEditApiKey("");
    setEditApiKeySet(false);
    setEditBaseUrl(PROVIDER_INFO.ollama.defaultBaseUrl);
    setEditModel(PROVIDER_INFO.ollama.models[0]);
    setError("");
    setSuccess("");
    setTestResult(null);
  };

  // ── Cancel new ──
  const handleCancelNew = () => {
    setIsCreating(false);
    if (profiles.length > 0) setSelectedId(profiles[0].id);
  };

  // ── Provider change (resets form fields) ──
  const handleProviderChange = (newProvider: AiProvider) => {
    setEditProvider(newProvider);
    setEditBaseUrl(PROVIDER_INFO[newProvider].defaultBaseUrl);
    setEditModel(PROVIDER_INFO[newProvider].models[0]);
    setEditApiKey("");
    setEditApiKeySet(false);
    setTestResult(null);
  };

  // ── Save profile (create or update) ──
  const handleSave = async () => {
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      if (isCreating) {
        const res = await fetch("/api/ai/profiles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: editName,
            provider: editProvider,
            apiKey: editApiKey || undefined,
            baseUrl: editBaseUrl,
            model: editModel,
          }),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          setError(body.error || "Failed to create profile");
          return;
        }

        const created = await res.json();
        setProfiles((prev) => [...prev, created]);
        setSelectedId(created.id);
        setIsCreating(false);
        setSuccess("Profile created!");
        if (editApiKey) setEditApiKeySet(true);
      } else if (selectedId) {
        const res = await fetch(`/api/ai/profiles/${selectedId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: editName,
            provider: editProvider,
            apiKey: editApiKey || undefined,
            baseUrl: editBaseUrl,
            model: editModel,
          }),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          setError(body.error || "Failed to save profile");
          return;
        }

        const updated = await res.json();
        setProfiles((prev) => prev.map((p) => (p.id === selectedId ? updated : p)));
        setSuccess("Profile saved!");
        if (editApiKey) setEditApiKeySet(true);
      }
    } catch {
      setError("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  // ── Delete profile ──
  const handleDelete = async () => {
    if (!selectedId) return;
    if (!confirm("Delete this profile?")) return;

    try {
      const res = await fetch(`/api/ai/profiles/${selectedId}`, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error || "Failed to delete");
        return;
      }
      setProfiles((prev) => prev.filter((p) => p.id !== selectedId));
      setSelectedId(null);
      setSuccess("Profile deleted");
    } catch {
      setError("Failed to delete profile");
    }
  };

  // ── Activate profile ──
  const handleActivate = async () => {
    if (!selectedId) return;

    try {
      const res = await fetch(`/api/ai/profiles/${selectedId}/activate`, { method: "POST" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error || "Failed to activate");
        return;
      }
      setProfiles((prev) =>
        prev.map((p) => ({ ...p, isDefault: p.id === selectedId }))
      );
      setSuccess("Active profile updated!");
    } catch {
      setError("Failed to activate profile");
    }
  };

  // ── Test connection ──
  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: "Say hello in one word.",
          systemPrompt: "You are a helpful assistant. Respond with one word only.",
          entityType: "blog",
          locale: "en",
          providerConfig: { provider: editProvider, apiKey: editApiKey, baseUrl: editBaseUrl, model: editModel },
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setTestResult({ ok: false, message: body.error || `HTTP ${res.status}` });
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        setTestResult({ ok: false, message: "No response stream" });
        return;
      }

      const decoder = new TextDecoder();
      let text = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") break;
          try {
            const parsed = JSON.parse(data);
            if (parsed.text) text += parsed.text;
          } catch { /* skip */ }
        }
      }

      setTestResult({
        ok: true,
        message: `Connection successful! Response: "${text.trim()}"`,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setTestResult({ ok: false, message: msg });
    } finally {
      setTesting(false);
    }
  };

  // ── Save Tavily key ──
  const handleSaveTavily = async () => {
    setSavingTavily(true);
    try {
      const res = await fetch("/api/ai/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tavilyApiKey: tavilyApiKey || null }),
      });
      if (res.ok) {
        setTavilyKeySet(!!tavilyApiKey);
        setSuccess("Tavily key saved!");
      }
    } finally {
      setSavingTavily(false);
    }
  };

  // ── Test Tavily ──
  const handleTestSearch = async () => {
    if (!tavilyApiKey) {
      setSearchTestResult({ ok: false, message: "Enter a Tavily API key first" });
      return;
    }

    setTestingSearch(true);
    setSearchTestResult(null);

    try {
      const res = await fetch("/api/ai/web-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: "Next.js SEO best practices", maxResults: 3 }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSearchTestResult({ ok: false, message: data.error || `HTTP ${res.status}` });
        return;
      }

      const resultCount = data.results?.length || 0;
      setSearchTestResult({
        ok: true,
        message: `Search works! Found ${resultCount} results. ${data.answer ? "AI summary available." : ""}`,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setSearchTestResult({ ok: false, message: msg });
    } finally {
      setTestingSearch(false);
    }
  };

  const activeProfile = profiles.find((p) => p.isDefault);

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Bot className="h-6 w-6" />
        AI Settings
      </h1>

      {/* ── Provider Profiles ── */}
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-4">
        {/* Profile List */}
        <Card className="md:row-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Profiles</CardTitle>
              <Button size="sm" variant="outline" onClick={handleNew}>
                <Plus className="h-3.5 w-3.5 me-1" />
                New
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-2">
            {loadingProfiles ? (
              <div className="p-4 text-sm text-muted-foreground">Loading...</div>
            ) : profiles.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground text-center">
                No profiles yet. Click &quot;New&quot; to create one.
              </div>
            ) : (
              <div className="space-y-1">
                {profiles.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => { setSelectedId(p.id); setIsCreating(false); setError(""); setSuccess(""); setTestResult(null); }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${
                      selectedId === p.id && !isCreating
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "hover:bg-muted border border-transparent"
                    }`}
                  >
                    {p.isDefault && <Star className="h-3.5 w-3.5 text-yellow-500 shrink-0 fill-yellow-500" />}
                    <span className="truncate flex-1">{p.name}</span>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {PROVIDER_INFO[p.provider]?.label || p.provider}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Form */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                {isCreating ? "New Profile" : "Edit Profile"}
              </CardTitle>
              {!isCreating && selectedId && (
                <div className="flex gap-1.5">
                  <Button
                    size="sm"
                    variant={activeProfile?.id === selectedId ? "default" : "outline"}
                    onClick={handleActivate}
                    disabled={activeProfile?.id === selectedId}
                  >
                    {activeProfile?.id === selectedId ? (
                      <><CheckCircle className="h-3.5 w-3.5 me-1" /> Active</>
                    ) : (
                      <><Star className="h-3.5 w-3.5 me-1" /> Set Active</>
                    )}
                  </Button>
                  <Button size="sm" variant="destructive" onClick={handleDelete}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {(isCreating || selectedId) ? (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Profile Name</label>
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="e.g. OpenAI GPT-4, Claude Sonnet, Ollama Local"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">AI Provider</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.keys(PROVIDER_INFO) as AiProvider[]).map((p) => (
                      <button
                        key={p}
                        onClick={() => handleProviderChange(p)}
                        className={`px-3 py-2 rounded-md border text-sm text-left transition-colors ${
                          editProvider === p
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:bg-muted"
                        }`}
                      >
                        {PROVIDER_INFO[p].label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    API Key
                    {editApiKeySet && !editApiKey && (
                      <span className="text-green-500 ml-2 text-xs">(already set)</span>
                    )}
                  </label>
                  <Input
                    type="password"
                    value={editApiKey}
                    onChange={(e) => setEditApiKey(e.target.value)}
                    placeholder={editApiKeySet ? "Enter new key to replace" : editProvider === "ollama" ? "Optional for local, required for cloud" : `Enter ${PROVIDER_INFO[editProvider].label} API key`}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Base URL</label>
                  <Input
                    value={editBaseUrl}
                    onChange={(e) => setEditBaseUrl(e.target.value)}
                    placeholder={PROVIDER_INFO[editProvider].defaultBaseUrl}
                  />
                  <p className="text-xs text-muted-foreground">
                    Default: {PROVIDER_INFO[editProvider].defaultBaseUrl}
                    {editProvider === "ollama" && " — For Ollama Cloud, use https://ollama.com"}
                    {editProvider === "openai" && " (works with OpenAI, OpenRouter, Together, etc.)"}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Model</label>
                  <Input
                    value={editModel}
                    onChange={(e) => setEditModel(e.target.value)}
                    placeholder={PROVIDER_INFO[editProvider].models[0]}
                    list={`models-${editProvider}`}
                  />
                  <datalist id={`models-${editProvider}`}>
                    {PROVIDER_INFO[editProvider].models.map((m) => (
                      <option key={m} value={m} />
                    ))}
                  </datalist>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button onClick={handleSave} disabled={saving || !editName}>
                    <Save className="me-2 h-4 w-4" />
                    {saving ? "Saving..." : isCreating ? "Create Profile" : "Save"}
                  </Button>
                  {isCreating && (
                    <Button variant="outline" onClick={handleCancelNew}>Cancel</Button>
                  )}
                  <Button variant="outline" onClick={handleTest} disabled={testing}>
                    {testing ? (
                      <Loader2 className="me-2 h-4 w-4 animate-spin" />
                    ) : (
                      <TestTube className="me-2 h-4 w-4" />
                    )}
                    {testing ? "Testing..." : "Test"}
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-sm text-muted-foreground text-center py-8">
                Select a profile to edit, or create a new one.
              </div>
            )}

            {error && <p className="text-sm text-red-500">{error}</p>}
            {success && <p className="text-sm text-green-500">{success}</p>}

            {testResult && (
              <div
                className={`flex items-start gap-2 p-3 rounded-md text-sm ${
                  testResult.ok
                    ? "bg-green-500/10 text-green-600 dark:text-green-400"
                    : "bg-red-500/10 text-red-600 dark:text-red-400"
                }`}
              >
                {testResult.ok ? (
                  <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" />
                ) : (
                  <XCircle className="h-4 w-4 mt-0.5 shrink-0" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Tavily Web Search ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="h-5 w-5" />
            Web Search (Tavily)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Tavily provides web search for SEO keyword research. Free tier: 1000 searches/month.
            Get an API key from <code>tavily.com</code>.
          </p>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Tavily API Key
              {tavilyKeySet && !tavilyApiKey && (
                <span className="text-green-500 ml-2 text-xs">(already set)</span>
              )}
            </label>
            <Input
              type="password"
              value={tavilyApiKey}
              onChange={(e) => setTavilyApiKey(e.target.value)}
              placeholder={tavilyKeySet ? "Enter new key to replace" : "tvly-..."}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSaveTavily} disabled={savingTavily}>
              <Save className="me-2 h-4 w-4" />
              {savingTavily ? "Saving..." : "Save Key"}
            </Button>
            <Button variant="outline" onClick={handleTestSearch} disabled={testingSearch}>
              {testingSearch ? (
                <Loader2 className="me-2 h-4 w-4 animate-spin" />
              ) : (
                <Search className="me-2 h-4 w-4" />
              )}
              {testingSearch ? "Testing..." : "Test Search"}
            </Button>
          </div>

          {searchTestResult && (
            <div
              className={`flex items-start gap-2 p-3 rounded-md text-sm ${
                searchTestResult.ok
                  ? "bg-green-500/10 text-green-600 dark:text-green-400"
                  : "bg-red-500/10 text-red-600 dark:text-red-400"
              }`}
            >
              {searchTestResult.ok ? (
                <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" />
              ) : (
                <XCircle className="h-4 w-4 mt-0.5 shrink-0" />
              )}
              <span>{searchTestResult.message}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Help ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Provider Help</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-3">
          <div>
            <p className="font-medium text-foreground">Ollama</p>
            <p>Local: Free, runs on your machine. Install from <code>ollama.com</code>, then pull a model: <code>ollama pull llama3</code>. No API key needed.</p>
            <p className="mt-1">Cloud: Use your Ollama API key (create at <code>ollama.com/settings/keys</code>). Set base URL to <code>https://ollama.com</code> and pick a cloud model like <code>gpt-oss:120b</code>.</p>
          </div>
          <div>
            <p className="font-medium text-foreground">OpenAI-Compatible</p>
            <p>Works with OpenAI, OpenRouter, Together AI, LM Studio, and any OpenAI-compatible API. Enter the provider&apos;s base URL and API key.</p>
          </div>
          <div>
            <p className="font-medium text-foreground">Claude (Anthropic)</p>
            <p>Get an API key from <code>console.anthropic.com</code>. Requires billing setup.</p>
          </div>
          <div>
            <p className="font-medium text-foreground">Google AI Studio</p>
            <p>Free tier available. Get an API key from <code>aistudio.google.com</code>.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
