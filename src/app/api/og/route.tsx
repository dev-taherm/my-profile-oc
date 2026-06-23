import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/constants";

export const runtime = "nodejs";

async function loadFont(locale: string): Promise<ArrayBuffer | null> {
  if (locale === "ar") {
    const res = await fetch(new URL("/fonts/NotoSansArabic-Regular.ttf", siteConfig.url));
    if (res.ok) return res.arrayBuffer();
  }
  return null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || siteConfig.name;
  const subtitle = searchParams.get("subtitle") || "Software Engineer";
  const locale = searchParams.get("locale") || "en";

  const fontData = await loadFont(locale);
  const fontFamily = locale === "ar" && fontData ? "Noto Sans Arabic" : "sans-serif";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #111111 0%, #1a1a2e 100%)",
          color: "#ffffff",
          fontFamily,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div
            style={{
              fontSize: "64px",
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: "32px",
              fontWeight: 400,
              color: "#a0a0b0",
              lineHeight: 1.3,
            }}
          >
            {subtitle}
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "60px",
            left: "80px",
            fontSize: "24px",
            color: "#666680",
            fontWeight: 400,
          }}
        >
          {siteConfig.url.replace("https://", "")}
        </div>
        <div
          style={{
            position: "absolute",
            top: "60px",
            right: "80px",
            width: "48px",
            height: "48px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px",
            fontWeight: 700,
            color: "#ffffff",
          }}
        >
          TM
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: fontData
        ? [
            {
              name: "Noto Sans Arabic",
              data: fontData,
              style: "normal",
              weight: 400,
            },
          ]
        : undefined,
    },
  );
}
