"use client";
import { Toaster } from "react-hot-toast";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { AdminSidebar } from "@/components/dashboard/Sidebar";
import { useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <ClerkProvider signInUrl="/signin" signUpUrl="/signup" afterSignOutUrl="/">
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <div className="flex">
            <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
            <main
              className={`flex-1 min-h-screen p-10 transition-all duration-300 ${
                sidebarOpen ? "ml-74 bg-gray-200" : "ml-16 bg-gray-200"
              }`}
            >
              {children}
            </main>
          </div>
        </body>
      </html>
      <Toaster />
    </ClerkProvider>
  );
}
