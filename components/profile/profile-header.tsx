"use client";

import type { User } from "@/types/users";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, Phone, Calendar, LayoutDashboard } from "lucide-react";
import { format } from "date-fns";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

interface ProfileHeaderProps {
  user: User;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const { user: clerkUser } = useUser();
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="p-6 md:p-8">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <Avatar className="h-24 w-24 md:h-32 md:w-32">
          <AvatarImage src={`${clerkUser?.imageUrl}`} alt={user.name} />
          <AvatarFallback className="text-2xl md:text-3xl">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-balance">
                {clerkUser?.fullName}
              </h1>
              {/* {user.bio && (
                <p className="text-muted-foreground mt-2 text-pretty">
                  {user.bio}
                </p>
              )} */}
            </div>
            <Link href={"/dashboard"}>
              <Button
                variant="outline"
                size="sm"
                className="w-fit cursor-pointer bg-transparent"
              >
                <LayoutDashboard className="h-4 w-4 mr-1" />
                Admin Dashboard
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>ashimmaskey4@gmail.com</span>
            </div>
            {user.phone && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{user.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Member since {format(user.memberSince, "MMM yyyy")}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
