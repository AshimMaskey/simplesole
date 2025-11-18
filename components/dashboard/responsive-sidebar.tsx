"use client";
import React, { useEffect, useState } from "react";
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
  IconMenu2,
  IconX,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { SignOutButton, useUser } from "@clerk/nextjs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

export function ResponsiveSidebar({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [setOpen]);

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
    <>
      {isMobile && open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
          aria-label="Sidebar overlay"
        />
      )}

      {isMobile && (
        <button
          onClick={() => setOpen(!open)}
          className="fixed top-4 left-4 z-50 rounded-md p-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 md:hidden"
          aria-label="Toggle sidebar"
        >
          {open ? (
            <IconX className="h-6 w-6" />
          ) : (
            <IconMenu2 className="h-6 w-6" />
          )}
        </button>
      )}

      <div
        className={cn(
          "fixed left-0 top-0 h-screen border-r border-neutral-200 bg-gray-100 dark:border-neutral-700 dark:bg-neutral-900",
          open
            ? isMobile
              ? "w-full md:w-[220px]"
              : "w-[220px]"
            : isMobile
            ? "-translate-x-full w-[220px]"
            : "w-16",
          "transition-all duration-300 z-40",
          isMobile && open ? "shadow-lg" : ""
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
    </>
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
