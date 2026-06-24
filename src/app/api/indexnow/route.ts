import { siteConfig } from "@/lib/constants";

const INDEXNOW_KEY = "2c227a79a1c1da01a46a2ab25c74311b7e9407c47ff4220c82593c1481077478";

export async function pingIndexNow(urls: string[]) {
  if (urls.length === 0) return;

  try {
    await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: "taher.pixovagency.com",
        key: INDEXNOW_KEY,
        keyLocation: `${siteConfig.url}/${INDEXNOW_KEY}.txt`,
        urlList: urls,
      }),
    });
  } catch {
    // IndexNow ping failed — non-critical
  }
}

export async function GET() {
  return Response.json({ status: "ok", key: INDEXNOW_KEY });
}
