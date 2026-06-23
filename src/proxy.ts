import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "@/lib/constants";

const TRACKABLE_PREFIXES = ["/en", "/ar"];
const ANALYTICS_IGNORED = ["/api", "/admin", "/_next", "/uploads", "/favicon"];

function shouldTrack(pathname: string): boolean {
  for (const p of ANALYTICS_IGNORED) {
    if (pathname.startsWith(p)) return false;
  }
  for (const p of TRACKABLE_PREFIXES) {
    if (pathname.startsWith(p)) return true;
  }
  if (pathname === "/") return true;
  return false;
}

function getLocaleFromRequest(request: NextRequest): string {
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale && locales.includes(cookieLocale as (typeof locales)[number])) {
    return cookieLocale;
  }

  const acceptLanguage = request.headers.get("accept-language");
  if (acceptLanguage) {
    const preferred = acceptLanguage
      .split(",")
      .map((lang) => {
        const [code, q] = lang.trim().split(";");
        return {
          code: code.split("-")[0],
          q: q ? parseFloat(q.split("=")[1]) : 1,
        };
      })
      .sort((a, b) => b.q - a.q);

    for (const { code } of preferred) {
      if (locales.includes(code as (typeof locales)[number])) {
        return code;
      }
    }
  }

  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  let response: NextResponse;

  if (pathnameHasLocale) {
    response = NextResponse.next();
  } else {
    const locale = getLocaleFromRequest(request);
    const newUrl = new URL(`/${locale}${pathname}`, request.url);
    response = NextResponse.redirect(newUrl);
    response.cookies.set("NEXT_LOCALE", locale, {
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
  }

  if (shouldTrack(pathname)) {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const body = JSON.stringify({
      path: request.nextUrl.pathname,
      referrer: request.headers.get("referer") || null,
      userAgent: request.headers.get("user-agent") || null,
      country: request.headers.get("cf-ipcountry") || null,
    });

    const url = request.nextUrl.clone();
    url.pathname = "/api/analytics";
    url.search = "";

    try {
      fetch(url.toString(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    } catch {}
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)"],
};
