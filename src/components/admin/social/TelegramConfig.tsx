"use client";

import { useEffect, useState } from "react";
import { Trash2, CheckCircle, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface TelegramConfig {
  id: string;
  chatId: string;
  name: string;
  isActive: boolean;
  postCount: number;
}

export function TelegramConfig({ onRefresh }: { onRefresh?: () => void }) {
  const [config, setConfig] = useState<TelegramConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [botToken, setBotToken] = useState("");
  const [chatId, setChatId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/social/accounts");
        const data = await res.json();
        if (!cancelled && data.account) {
          setConfig(data.account);
          setChatId(data.account.chatId);
        }
      } catch {
        // silent
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [refreshKey]);

  const handleSave = async () => {
    if (!botToken || !chatId) {
      setError("Bot token and chat ID are required");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/social/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ botToken, chatId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to save");
        return;
      }

      setSuccess("Telegram bot configured successfully!");
      setBotToken("");
      setRefreshKey((k) => k + 1);
      onRefresh?.();
    } catch {
      setError("Failed to save configuration");
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    if (!botToken || !chatId) {
      setError("Bot token and chat ID are required for testing");
      return;
    }

    setTesting(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/social/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ botToken, chatId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Test failed");
        return;
      }

      setSuccess(`Connected to ${data.botName}! Check your Telegram for a test message.`);
    } catch {
      setError("Test failed");
    } finally {
      setTesting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm("Disconnect Telegram bot?")) return;
    try {
      await fetch("/api/social/accounts", { method: "DELETE" });
      setConfig(null);
      setChatId("");
      onRefresh?.();
    } catch {
      // silent
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Loading...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121L8.32 13.617l-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
          </svg>
          Telegram Bot
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {config ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{config.name}</p>
                <p className="text-xs text-muted-foreground">
                  Chat ID: {config.chatId}
                </p>
                <p className="text-xs text-muted-foreground">
                  {config.postCount} posts sent
                </p>
              </div>
              <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                <CheckCircle className="h-3 w-3 me-1" />
                Connected
              </span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleDisconnect}>
                <Trash2 className="h-3.5 w-3.5 me-1" />
                Disconnect
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Configure a Telegram bot to receive generated posts for review before posting manually.
            </p>

            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Bot Token (from @BotFather)"
                value={botToken}
                onChange={(e) => setBotToken(e.target.value)}
              />
              <Input
                type="text"
                placeholder="Chat ID (your Telegram user ID)"
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
              />
            </div>

            <p className="text-xs text-muted-foreground">
              1. Message <a href="https://t.me/BotFather" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-0.5">@BotFather <ExternalLink className="h-3 w-3" /></a> and send /newbot
              <br />
              2. Send any message to your new bot
              <br />
              3. Visit <code className="text-xs bg-muted px-1 py-0.5 rounded">https://api.telegram.org/bot&lt;TOKEN&gt;/getUpdates</code> to find your chat_id
            </p>

            <div className="flex gap-2">
              <Button onClick={handleTest} disabled={testing || !botToken || !chatId} variant="outline" size="sm">
                {testing ? <Loader2 className="h-3.5 w-3.5 me-1 animate-spin" /> : null}
                Test Connection
              </Button>
              <Button onClick={handleSave} disabled={saving || !botToken || !chatId} size="sm">
                {saving ? <Loader2 className="h-3.5 w-3.5 me-1 animate-spin" /> : null}
                Save
              </Button>
            </div>
          </div>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}
        {success && <p className="text-sm text-green-600 dark:text-green-400">{success}</p>}
      </CardContent>
    </Card>
  );
}
