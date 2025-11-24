"use client";

import Link from "next/link";
import { useState } from "react";
import {
  X,
  Users,
  Settings,
  Home,
  Box,
  Star,
  ShoppingCart,
  LogOut,
  ChevronDown,
  ChevronUp,
  Sliders,
  Layout,
  Columns,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "./sidebar-context";
import { cn } from "@/lib/utils";
import { SignOutButton } from "@clerk/nextjs";
import Image from "next/image";
import { useReviewContext } from "@/contexts/ReviewContext";

const sidebarItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/users", label: "Users", icon: Users },
  { href: "/products", label: "Products", icon: Box },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/reviews", label: "Reviews", icon: Star },
  {
    label: "Settings",
    icon: Settings,
    subItems: [
      {
        href: "/settings/homepage",
        label: "Homepage",
        icon: Layout,
      },
      {
        href: "/settings/footer",
        label: "Footer",
        icon: Columns,
      },
    ],
  },
];

export function AdminSidebar() {
  const { isOpen, setIsOpen } = useSidebar();
  const { unseenCount } = useReviewContext();

  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 h-full w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-transform duration-300 ease-in-out z-40",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <Link href={"/"}>
            <div className="flex justify-center w-full items-center gap-2">
              <Image alt="logo" src={"/logo.png"} height={50} width={50} />
              <h1 className="text-2xl font-bold text-sidebar-primary">
                SoleMate
              </h1>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-2 p-4">
          {sidebarItems.map((item) => {
            if (item.subItems) {
              const isOpenMenu = openMenus.includes(item.label);
              return (
                <div key={item.label}>
                  <button
                    type="button"
                    onClick={() => toggleMenu(item.label)}
                    className={cn(
                      "flex cursor-pointer items-center justify-between w-full gap-3 px-4 py-2.5 rounded-lg transition-colors duration-200",
                      "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    {isOpenMenu ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                  {isOpenMenu && (
                    <div className="ml-4 mt-1 flex flex-col space-y-1">
                      {item.subItems.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-sidebar-foreground rounded-lg transition-colors duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        >
                          <sub.icon className="w-4 h-4 flex-shrink-0" />
                          <span>{sub.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors duration-200",
                  "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{item.label}</span>
                {item.label === "Reviews" && unseenCount > 0 && (
                  <span className=" bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                    {unseenCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 flex justify-center border-t border-sidebar-border">
          <SignOutButton>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 text-sm"
              onClick={() => setIsOpen(false)}
            >
              <LogOut />
              <span>Logout</span>
            </Button>
          </SignOutButton>
        </div>
      </aside>

      <div className="hidden md:block w-64 flex-shrink-0" />
    </>
  );
}
