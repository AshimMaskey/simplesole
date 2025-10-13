import React from "react";
import Image from "next/image";
import { NavigationMenuDemo } from "./NavMenu";
import { Input } from "../ui/input";
import { Heart, Search, ShoppingCart, UserRound } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

const Navbar = () => {
  return (
    <>
      <div className="px-10">
        <div className="flex items-center justify-between ">
          <div>
            <Link href={"/"}>
              <Image src={"/logo.png"} alt="logo" width={75} height={1000} />
            </Link>
          </div>
          <div>
            <NavigationMenuDemo />
          </div>
          <div className="flex gap-3 items-center">
            <div className="relative">
              <Input className="pl-10" type="text" placeholder="Search" />
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 "
                size={16}
              />
            </div>
            <div>
              <Link href={"/cart"}>
                <Button size={"icon"} variant={"ghost"}>
                  <ShoppingCart />
                </Button>
              </Link>
            </div>
            <div>
              <Button size={"icon"} variant="ghost">
                <Heart />
              </Button>
            </div>
            <div>
              <Button size={"icon"} variant={"ghost"}>
                <UserRound />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
