"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, Phone, Calendar, LayoutDashboard, LogOut } from "lucide-react";
import { format } from "date-fns";
import { SignOutButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

interface DBUser {
  id: string;
  fullName: string | null;
  email: string | null;
  image_url: string | null;
  phone: string | null;
  dob: string | null;
  createdAt: string;
}

export function ProfileHeader() {
  const { user: clerkUser } = useUser();
  const [dbUser, setDbUser] = useState<DBUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/user/${clerkUser?.id}`);
        const data = await res.json();
        setDbUser(data);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [clerkUser]);

  if (loading) {
    return (
      <Card className="p-6 md:p-8 animate-pulse">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="h-32 w-32 bg-muted rounded-full" />

          <div className="flex-1 space-y-4">
            <div className="h-6 w-48 bg-muted rounded" />
            <div className="h-5 w-36 bg-muted rounded" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm pt-4">
              <div className="h-4 w-40 bg-muted rounded" />
              <div className="h-4 w-32 bg-muted rounded" />
              <div className="h-4 w-36 bg-muted rounded" />
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (!dbUser) {
    return <Card className="p-6">Failed to load user</Card>;
  }

  return (
    <Card className="p-6 md:p-8">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <Avatar className="h-24 w-24 md:h-32 md:w-32">
          <AvatarImage
            src={clerkUser?.imageUrl || dbUser.image_url || ""}
            alt={dbUser.fullName || "User"}
          />
          <AvatarFallback className="text-2xl md:text-3xl">U</AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">
                {clerkUser?.fullName || dbUser.fullName}
              </h1>
            </div>

            <div>
              <SignOutButton>
                <Button variant="outline" size="sm" className="cursor-pointer">
                  <LogOut className="h-4 w-4 mr-1" />
                  Log Out
                </Button>
              </SignOutButton>

              <Link href="/dashboard">
                <Button
                  variant="outline"
                  size="sm"
                  className="cursor-pointer ml-3"
                >
                  <LayoutDashboard className="h-4 w-4 mr-1" />
                  Admin Dashboard
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>{dbUser.email}</span>
            </div>

            {dbUser.phone && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{dbUser.phone}</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                Member since{" "}
                {dbUser?.createdAt
                  ? format(new Date(dbUser.createdAt), "MMM yyyy")
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
