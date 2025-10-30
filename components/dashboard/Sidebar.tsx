"use client";
import React from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";
import {
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconPackage,
  IconShoppingCart,
  IconUsers,
  IconBox,
  IconTag,
  IconChartBar,
  IconLogout,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { SignOutButton, useUser } from "@clerk/nextjs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

export function AdminSidebar({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: (
        <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Products",
      href: "products",
      icon: (
        <IconPackage className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Users",
      href: "users",
      icon: (
        <IconUsers className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Reviews",
      href: "reviews",
      icon: (
        <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Orders",
      href: "#orders",
      icon: (
        <IconShoppingCart className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Inventory",
      href: "#inventory",
      icon: (
        <IconBox className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    // {
    //   label: "Discounts",
    //   href: "#discounts",
    //   icon: (
    //     <IconTag className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
    //   ),
    // },
    // {
    //   label: "Reports",
    //   href: "#reports",
    //   icon: (
    //     <IconChartBar className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
    //   ),
    // },

    {
      label: "Settings",
      href: "#settings",
      icon: (
        <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];
  const { user } = useUser();
  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-screen border-r border-neutral-200 bg-gray-100 dark:border-neutral-700 dark:bg-neutral-900",
        open ? "w-64" : "w-16",
        "transition-all duration-300"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div className="flex items-center mb-15">
            <SidebarLink
              className="mb-2"
              link={{
                label: `${user?.fullName || "...."}`,
                href: "#",
                icon: (
                  <img
                    src={`${user?.imageUrl || "/fallback.jpeg"}`}
                    className="h-7 w-7 shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
            {open && (
              <div className="ml-2 transition duration-300">
                <Tooltip>
                  <TooltipTrigger>
                    <SignOutButton>
                      <IconLogout className="h-5 w-7 cursor-pointer shrink-0 text-neutral-700 dark:text-neutral-200" />
                    </SignOutButton>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Log Out</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            )}
          </div>
        </SidebarBody>
      </Sidebar>
    </div>
  );
}
export const Logo = () => {
  return (
    <Link
      href="/"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />

      <h1 className="font-medium whitespace-pre text-black dark:text-white">
        SoleMate
      </h1>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
    </a>
  );
};
