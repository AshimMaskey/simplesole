"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Heart, Menu, Search, ShoppingCart, UserRound, X } from "lucide-react";

import { NavigationMenuDemo } from "./NavMenu";
import { useWishlist } from "@/contexts/WishlistContext";

const Navbar = () => {
  const { isSignedIn } = useUser();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  // useEffect(() => {
  //   const fetchCount = async () => {
  //     if (!user) return;
  //     const res = await getWishlistCount(user.id);
  //     if (res.success) setWishlistCount(res.count || 0);
  //   };
  //   fetchCount();
  // }, [user]);
  const { count: wishlistCount } = useWishlist();

  const handleProfileClick = () => {
    router.push(isSignedIn ? "/profile" : "/login");
  };

  return (
    <>
      {/* NAVBAR */}
      <div className="px-4 md:px-12 fixed top-0 left-0 w-full bg-white z-50 border-b border-gray-300">
        <div className="flex items-center justify-between h-16">
          {/* LOGO */}
          <Link href="/">
            <Image src="/logo.png" alt="logo" width={70} height={70} />
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden lg:block">
            <NavigationMenuDemo />
          </div>

          {/* RIGHT SIDE ICONS */}
          <div className="flex items-center gap-1 md:gap-2">
            {/* SEARCH BAR (hidden on mobile) */}
            <div className="relative hidden md:block">
              <Link href="/search">
                <Input
                  disabled
                  type="text"
                  placeholder="Search"
                  className="pl-10 border-2 border-gray-400"
                />
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  size={16}
                />
              </Link>
            </div>

            {/* CART */}
            <Link href="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart />
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-semibold rounded-full px-[6px] py-[1px]">
                  {wishlistCount}
                </span>
              </Button>
            </Link>

            {/* WISHLIST */}
            {/* WISHLIST */}
            <Link href="/wishlist" className="relative">
              <Button variant="ghost" size="icon">
                <Heart />
              </Button>

              {/* Wishlist count badge */}
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-semibold rounded-full px-[6px] py-[1px]">
                {wishlistCount}
              </span>
            </Link>

            {/* PROFILE */}
            <Button variant="ghost" size="icon" onClick={handleProfileClick}>
              <UserRound />
            </Button>

            {/* MOBILE HAMBURGER */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X /> : <Menu />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="lg:hidden w-full bg-white border-b shadow-sm p-4 mt-16 space-y-4 fixed z-40">
          <Link
            href="/mens"
            onClick={() => setIsOpen(false)}
            className="block font-medium"
          >
            Mens
          </Link>
          <Link
            href="/womens"
            onClick={() => setIsOpen(false)}
            className="block font-medium"
          >
            Womens
          </Link>
          <Link
            href="/kids"
            onClick={() => setIsOpen(false)}
            className="block font-medium"
          >
            Kids
          </Link>
          <Link
            href="/shop"
            onClick={() => setIsOpen(false)}
            className="block font-medium"
          >
            Shop
          </Link>

          {/* Optional: mobile search */}
          <div className="relative">
            <Link href="/search">
              <Input
                disabled
                type="text"
                placeholder="Search"
                className="pl-10 border-2 border-gray-400"
              />
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2"
                size={16}
              />
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
