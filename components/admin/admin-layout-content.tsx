"use client";
import {
  SidebarProvider,
  useSidebar,
} from "@/components/sidebar/sidebar-context";
import { AdminSidebar } from "@/components/sidebar/admin-sidebar";
import { ReviewProvider } from "@/contexts/ReviewContext";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function AdminLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen, setIsOpen } = useSidebar();

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 transition-all duration-300">
        <div className="md:hidden p-4 border-b border-border">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle sidebar"
          >
            <Menu className="w-6 h-6" />
          </Button>
        </div>
        <div className="p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}
