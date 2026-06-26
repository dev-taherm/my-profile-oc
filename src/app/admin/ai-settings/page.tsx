"use client";

import { useEffect, useState } from "react";
import { Bot, Save, TestTube, CheckCircle, XCircle, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type AiProvider = "ollama" | "openai" | "claude" | "google";

const PROVIDER_INFO: Record<AiProvider, { label: string; defaultBaseUrl: string; models: string[] }> = {
  ollama: {
    label: "Ollama (Local)",
    defaultBaseUrl: "http://localhost:11434",
    models: ["llama3", "llama3.1", "mistral", "codellama", "phi3", "gemma2"],
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
  const [provider, setProvider] = useState<AiProvider>("ollama");
  const [apiKey, setApiKey] = useState("");
  const [apiKeySet, setApiKeySet] = useState(false);
  const [baseUrl, setBaseUrl] = useState("");
  const [model, setModel] = useState("");
  const [tavilyApiKey, setTavilyApiKey] = useState("");
  const [tavilyKeySet, setTavilyKeySet] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);

  const [testingSearch, setTestingSearch] = useState(false);
  const [searchTestResult, setSearchTestResult] = useState<{ ok: boolean; message: string } | null>(null);

  useEffect(() => {
    fetch("/api/ai/settings")
      .then((r) => r.json())
      .then((data) => {
        const p = (data.provider || "ollama") as AiProvider;
        setProvider(p);
        if (data.baseUrl) setBaseUrl(data.baseUrl);
        if (data.model) {
          setModel(data.model);
        } else {
          setModel(PROVIDER_INFO[p]?.models[0] || "");
        }
        if (data.apiKeySet) setApiKeySet(data.apiKeySet);
        if (data.tavilyApiKey) setTavilyApiKey(data.tavilyApiKey);
        if (data.tavilyKeySet) setTavilyKeySet(data.tavilyKeySet);
      });
  }, []);

  const handleProviderChange = (newProvider: AiProvider) => {
    setProvider(newProvider);
    setBaseUrl(PROVIDER_INFO[newProvider].defaultBaseUrl);
    setModel(PROVIDER_INFO[newProvider].models[0]);
    setApiKey("");
    setApiKeySet(false);
    setTestResult(null);
  };

  const handleSave = async () => {
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const res = await fetch("/api/ai/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          apiKey: apiKey || undefined,
          baseUrl,
          model,
          tavilyApiKey: tavilyApiKey || undefined,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error || "Failed to save");
        return;
      }

      setSuccess("AI settings saved successfully!");
      if (apiKey) setApiKeySet(true);
      if (tavilyApiKey) setTavilyKeySet(true);
    } catch {
      setError("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

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
          providerConfig: { provider, apiKey, baseUrl, model },
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

  const needsApiKey = provider !== "ollama";

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Bot className="h-6 w-6" />
        AI Settings
      </h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Provider Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">AI Provider</label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(PROVIDER_INFO) as AiProvider[]).map((p) => (
                <button
                  key={p}
                  onClick={() => handleProviderChange(p)}
                  className={`px-3 py-2 rounded-md border text-sm text-left transition-colors ${
                    provider === p
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:bg-muted"
                  }`}
                >
                  {PROVIDER_INFO[p].label}
                </button>
              ))}
            </div>
          </div>

          {needsApiKey && (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                API Key
                {apiKeySet && !apiKey && (
                  <span className="text-green-500 ml-2 text-xs">(already set)</span>
                )}
              </label>
              <Input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={apiKeySet ? "Enter new key to replace" : `Enter ${PROVIDER_INFO[provider].label} API key`}
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Base URL</label>
            <Input
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder={PROVIDER_INFO[provider].defaultBaseUrl}
            />
            <p className="text-xs text-muted-foreground">
              Default: {PROVIDER_INFO[provider].defaultBaseUrl}
              {provider === "ollama" && " (for remote Ollama, change this URL)"}
              {provider === "openai" && " (works with OpenAI, OpenRouter, Together, etc.)"}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Model</label>
            <Input
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder={PROVIDER_INFO[provider].models[0]}
              list={`models-${provider}`}
            />
            <datalist id={`models-${provider}`}>
              {PROVIDER_INFO[provider].models.map((m) => (
                <option key={m} value={m} />
              ))}
            </datalist>
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={handleSave} disabled={saving}>
              <Save className="me-2 h-4 w-4" />
              {saving ? "Saving..." : "Save Settings"}
            </Button>
            <Button variant="outline" onClick={handleTest} disabled={testing}>
              {testing ? (
                <Loader2 className="me-2 h-4 w-4 animate-spin" />
              ) : (
                <TestTube className="me-2 h-4 w-4" />
              )}
              {testing ? "Testing..." : "Test Connection"}
            </Button>
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
          {success && (
            <p className="text-sm text-green-500">{success}</p>
          )}

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

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Provider Help</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-3">
          <div>
            <p className="font-medium text-foreground">Ollama (Local)</p>
            <p>Free, runs locally. Install Ollama from <code>ollama.com</code>, then pull a model: <code>ollama pull llama3</code></p>
          </div>
          <div>
            <p className="font-medium text-foreground">OpenAI-Compatible</p>
            <p>Works with OpenAI, OpenRouter, Together AI, LM Studio, and any OpenAI-compatible API. Enter the provider's base URL and API key.</p>
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
