"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NotFound() {
  const pathname = usePathname();
  const locale = pathname.split("/")[1];
  const isAr = locale === "ar";

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">
          {isAr ? "الصفحة غير موجودة" : "Page not found"}
        </p>
        <Link
          href={`/${locale || "en"}`}
          className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          {isAr ? "العودة للرئيسية" : "Back to Home"}
        </Link>
      </div>
    </div>
  );
}
