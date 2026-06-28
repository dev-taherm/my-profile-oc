"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AiPanelProvider, useAiPanel } from "@/contexts/AiPanelContext";
import { AiChatPanel } from "@/components/admin/AiChatPanel";
import { Sheet, SheetContent } from "@/components/ui/sheet";

const PUBLIC_ADMIN_ROUTES = ["/admin/login", "/admin/change-password"];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AiPanelProvider>
        <AdminLayoutInner>{children}</AdminLayoutInner>
      </AiPanelProvider>
    </SessionProvider>
  );
}

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated" && !PUBLIC_ADMIN_ROUTES.includes(pathname)) {
      router.push("/admin/login");
    }
  }, [status, router, pathname]);

  useEffect(() => {
    if (status === "authenticated" && session?.user && !session.user.passwordChanged && !PUBLIC_ADMIN_ROUTES.includes(pathname)) {
      router.push("/admin/change-password");
    }
  }, [status, session, router, pathname]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (PUBLIC_ADMIN_ROUTES.includes(pathname)) {
    return <>{children}</>;
  }

  if (!session) return null;

  if (!session.user?.passwordChanged) return null;

  return <AdminLayoutShell>{children}</AdminLayoutShell>;
}

function AdminLayoutShell({ children }: { children: React.ReactNode }) {
  const { isOpen, panelData, closePanel } = useAiPanel();
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Auto-close AI panel on navigation
  useEffect(() => {
    closePanel();
  }, [pathname, closePanel]);

  // Mobile: AI panel opens as Sheet overlay
  if (isMobile) {
    return (
      <div className="min-h-screen flex">
        <AdminSidebar />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
        <Sheet open={isOpen} onOpenChange={(open) => !open && closePanel()}>
          <SheetContent side="right" className="w-full p-0 sm:w-96">
            {panelData && (
              <AiChatPanel
                currentContent={panelData.currentContent}
                title={panelData.title}
                excerpt={panelData.excerpt}
                locale={panelData.locale}
                entityType={panelData.entityType}
                availableTags={panelData.availableTags}
                availableCategories={panelData.availableCategories}
                existingArticles={panelData.existingArticles}
                storageKey={panelData.storageKey}
                onClose={closePanel}
              />
            )}
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  // Desktop: <main> is always at the same DOM depth (second child of root div).
  // AI panel is a conditional sibling — its mount/unmount does not affect <main>.
  return (
    <div className={isOpen ? "h-screen flex" : "min-h-screen flex"}>
      <AdminSidebar collapsed={isOpen} />
      <main
        className={
          isOpen
            ? "w-1/2 h-full overflow-auto p-6 md:p-8"
            : "flex-1 overflow-auto p-6 md:p-8"
        }
      >
        {children}
      </main>
      {isOpen && panelData && (
        <div className="w-1/2 h-screen overflow-auto border-l">
          <AiChatPanel
            currentContent={panelData.currentContent}
            title={panelData.title}
            excerpt={panelData.excerpt}
            locale={panelData.locale}
            entityType={panelData.entityType}
            availableTags={panelData.availableTags}
            availableCategories={panelData.availableCategories}
            existingArticles={panelData.existingArticles}
            storageKey={panelData.storageKey}
            onClose={closePanel}
          />
        </div>
      )}
    </div>
  );
}
