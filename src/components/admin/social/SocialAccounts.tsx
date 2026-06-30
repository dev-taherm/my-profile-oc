"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Trash2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SocialAccount {
  id: string;
  provider: string;
  providerAccountId: string;
  name: string;
  isActive: boolean;
  tokenExpiry: string | null;
  hasRefreshToken: boolean;
  postCount: number;
  isExpired: boolean;
}

export function SocialAccounts({ onRefresh }: { onRefresh?: () => void }) {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<string | null>(null);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/social/accounts");
      const data = await res.json();
      setAccounts(data.accounts || []);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleConnect = (provider: string) => {
    setConnecting(provider);
    window.location.href = `/api/social/connect/${provider}`;
  };

  const handleDisconnect = async (id: string) => {
    if (!confirm("Disconnect this account?")) return;
    try {
      await fetch(`/api/social/accounts/${id}`, { method: "DELETE" });
      await fetchAccounts();
      onRefresh?.();
    } catch {
      // silent
    }
  };

  const handleRefreshToken = async (id: string) => {
    try {
      const res = await fetch(`/api/social/refresh-token/${id}`, { method: "POST" });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Refresh failed");
      }
      await fetchAccounts();
    } catch {
      alert("Refresh failed");
    }
  };

  const facebookAccount = accounts.find((a) => a.provider === "facebook");
  const linkedinAccount = accounts.find((a) => a.provider === "linkedin");

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Loading accounts...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Facebook
          </CardTitle>
        </CardHeader>
        <CardContent>
          {facebookAccount ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{facebookAccount.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Page ID: {facebookAccount.providerAccountId}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {facebookAccount.postCount} posts published
                  </p>
                </div>
                <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  Connected
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDisconnect(facebookAccount.id)}
                >
                  <Trash2 className="h-3.5 w-3.5 me-1" />
                  Disconnect
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground mb-3">
                Connect your Facebook Page to publish posts
              </p>
              <Button
                onClick={() => handleConnect("facebook")}
                disabled={connecting === "facebook"}
                size="sm"
              >
                {connecting === "facebook" ? "Connecting..." : "Connect Facebook"}
                <ExternalLink className="h-3.5 w-3.5 ms-1.5" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            LinkedIn
          </CardTitle>
        </CardHeader>
        <CardContent>
          {linkedinAccount ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{linkedinAccount.name}</p>
                  <p className="text-xs text-muted-foreground">
                    URN: {linkedinAccount.providerAccountId}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {linkedinAccount.postCount} posts published
                  </p>
                  {linkedinAccount.isExpired && (
                    <p className="text-xs text-destructive mt-1">Token expired</p>
                  )}
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    linkedinAccount.isExpired
                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  }`}
                >
                  {linkedinAccount.isExpired ? "Needs Refresh" : "Connected"}
                </span>
              </div>
              <div className="flex gap-2">
                {linkedinAccount.hasRefreshToken && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRefreshToken(linkedinAccount.id)}
                  >
                    <RefreshCw className="h-3.5 w-3.5 me-1" />
                    Refresh Token
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDisconnect(linkedinAccount.id)}
                >
                  <Trash2 className="h-3.5 w-3.5 me-1" />
                  Disconnect
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground mb-3">
                Connect your LinkedIn profile to publish posts
              </p>
              <Button
                onClick={() => handleConnect("linkedin")}
                disabled={connecting === "linkedin"}
                size="sm"
              >
                {connecting === "linkedin" ? "Connecting..." : "Connect LinkedIn"}
                <ExternalLink className="h-3.5 w-3.5 ms-1.5" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
