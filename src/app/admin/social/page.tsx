"use client";

import { useEffect, useState } from "react";
import { TelegramConfig } from "@/components/admin/social/TelegramConfig";
import { SocialPostComposer } from "@/components/admin/social/SocialPostComposer";
import { SocialPostHistory } from "@/components/admin/social/SocialPostHistory";

export default function AdminSocialPage() {
  const [hasTelegram, setHasTelegram] = useState(false);
  const [historyKey, setHistoryKey] = useState(0);
  const [configKey, setConfigKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/social/accounts");
        const data = await res.json();
        if (!cancelled) setHasTelegram(!!data.account);
      } catch {
        if (!cancelled) setHasTelegram(false);
      }
    })();
    return () => { cancelled = true; };
  }, [configKey]);

  const handlePostSent = () => {
    setHistoryKey((k) => k + 1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Social Media</h1>
        <p className="text-muted-foreground">
          Generate social media posts with AI and send them to Telegram for review before posting manually
        </p>
      </div>

      <section>
        <h2 className="text-lg font-semibold mb-3">Telegram Bot</h2>
        <TelegramConfig onRefresh={() => setConfigKey((k) => k + 1)} />
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Compose & Generate</h2>
        <SocialPostComposer hasTelegram={hasTelegram} onPostSent={handlePostSent} />
      </section>

      <section>
        <SocialPostHistory key={historyKey} />
      </section>
    </div>
  );
}
