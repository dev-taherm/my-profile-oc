"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, FolderOpen, FileText, Tags, Tag, Layers, Settings, LogOut, Menu, ImageIcon, Bot, Share2, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";

const sidebarItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Projects", href: "/admin/projects", icon: FolderOpen },
  { label: "Services", href: "/admin/services", icon: Layers },
  { label: "Blog Posts", href: "/admin/blog", icon: FileText },
  { label: "Media", href: "/admin/media", icon: ImageIcon },
  { label: "Categories", href: "/admin/categories", icon: Tags },
  { label: "Tags", href: "/admin/tags", icon: Tag },
  { label: "Profile", href: "/admin/profile", icon: User },
  { label: "Social Media", href: "/admin/social", icon: Share2 },
  { label: "AI Settings", href: "/admin/ai-settings", icon: Bot },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

function SidebarContent({ onItemClick, collapsed }: { onItemClick?: () => void; collapsed?: boolean }) {
  const pathname = usePathname();

  const linkBaseClass = "flex items-center rounded-md text-sm transition-colors";

  return (
    <TooltipProvider delay={0}>
      <div className="flex flex-col h-full">
        <div className={cn("border-b", collapsed ? "p-3 flex justify-center" : "p-4")}>
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger
                render={
                  <Link href="/admin" onClick={onItemClick} className="text-lg font-bold" />
                }
              >
                A
              </TooltipTrigger>
              <TooltipContent side="right">Admin Panel</TooltipContent>
            </Tooltip>
          ) : (
            <Link href="/admin" className="text-lg font-bold" onClick={onItemClick}>
              Admin Panel
            </Link>
          )}
        </div>
        <nav className={cn("flex-1 space-y-1", collapsed ? "p-2" : "p-3")}>
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;

            if (collapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger
                    render={
                      <Link
                        href={item.href}
                        onClick={onItemClick}
                        className={cn(
                          linkBaseClass,
                          "justify-center p-2",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                      />
                    }
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onItemClick}
                className={cn(
                  linkBaseClass,
                  "gap-3 px-3 py-2",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className={cn("border-t", collapsed ? "p-2" : "p-3")}>
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger
                className="flex items-center justify-center p-2 w-full rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                onClick={() => signOut({ callbackUrl: "/admin/login" })}
              >
                <LogOut className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent side="right">Logout</TooltipContent>
            </Tooltip>
          ) : (
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
            >
              <LogOut className="h-4 w-4 me-2" />
              Logout
            </Button>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}

export function AdminSidebar({ collapsed = false }: { collapsed?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop */}
      <div className={cn("hidden md:block border-e bg-muted/30 shrink-0 transition-all duration-200", collapsed ? "w-16" : "w-64")}>
        <SidebarContent collapsed={collapsed} />
      </div>

      {/* Mobile */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button variant="ghost" size="icon" className="md:hidden fixed top-4 start-4 z-50" />
          }
        >
          <Menu className="h-5 w-5" />
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent onItemClick={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  );
}
