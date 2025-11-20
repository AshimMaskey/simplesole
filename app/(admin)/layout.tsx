"use client";
import { Toaster } from "react-hot-toast";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
function AdminLayoutContent({ children }: { children: React.ReactNode }) {
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

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider signInUrl="/signin" signUpUrl="/signup" afterSignOutUrl="/">
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ReviewProvider>
            <SidebarProvider>
              <AdminLayoutContent>{children}</AdminLayoutContent>
            </SidebarProvider>
          </ReviewProvider>
        </body>
      </html>
      <Toaster />
    </ClerkProvider>
  );
}

import {
  SidebarProvider,
  useSidebar,
} from "@/components/sidebar/sidebar-context";
import { AdminSidebar } from "@/components/sidebar/admin-sidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { ReviewProvider } from "@/contexts/ReviewContext";
