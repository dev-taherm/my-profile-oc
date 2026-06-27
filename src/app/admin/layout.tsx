"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import { Group as PanelGroup, Panel, Separator } from "react-resizable-panels";
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

  // Mobile: AI panel opens as full-screen Sheet overlay
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
                onClose={closePanel}
              />
            )}
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  // Desktop with AI panel open: resizable split view
  if (isOpen && panelData) {
    return (
      <div className="h-screen flex">
        <AdminSidebar collapsed />
        <PanelGroup orientation="horizontal" className="flex-1 h-full">
          <Panel defaultSize={50} minSize={30}>
            <main className="h-full overflow-auto p-6 md:p-8">
              {children}
            </main>
          </Panel>
          <Separator className="w-2 bg-border hover:bg-primary/20 transition-colors" />
          <Panel defaultSize={50} minSize={30}>
            <AiChatPanel
              currentContent={panelData.currentContent}
              title={panelData.title}
              excerpt={panelData.excerpt}
              locale={panelData.locale}
              entityType={panelData.entityType}
              availableTags={panelData.availableTags}
              availableCategories={panelData.availableCategories}
              existingArticles={panelData.existingArticles}
              onClose={closePanel}
            />
          </Panel>
        </PanelGroup>
      </div>
    );
  }

  // Desktop normal: sidebar + main
  return (
    <div className="min-h-screen flex">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
