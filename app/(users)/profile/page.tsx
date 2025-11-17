"use client";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileStats } from "@/components/profile/profile-stats";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { OrderHistory } from "@/components/profile/order-history";

export default function ProfilePage() {
  const [wishlistCount, setWishlistCount] = useState(0);
  const [distinctItemsOrdered, setDistinctItemsOrdered] = useState(0);

  const { user } = useUser();
  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;

    const fetchCount = async () => {
      const res = await fetch(`/api/wishlist-count?userId=${userId}`);
      const data = await res.json();
      setWishlistCount(data.count);
    };

    fetchCount();
  }, [userId]);
  useEffect(() => {
    if (!userId) return;

    const fetchDistinctItems = async () => {
      try {
        const res = await fetch(`/api/orders/distinct/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch distinct items");
        const data = await res.json();
        console.log("hello hello");
        console.log(data);
        setDistinctItemsOrdered(data.totalOrders);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDistinctItems();
  }, [userId]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <ProfileHeader />

        <ProfileStats
          totalOrders={distinctItemsOrdered}
          wishlistItems={wishlistCount}
        />

        {/* <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-grid">
            <TabsTrigger value="orders">Order History</TabsTrigger>
            <TabsTrigger value="addresses">Addresses</TabsTrigger>
          </TabsList> */}

        {/* <TabsContent value="orders" className="space-y-4"> */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Order History</h2>
        </div>
        <OrderHistory userId={userId || ""} />
        {/* </TabsContent> */}

        {/* <TabsContent value="addresses">
            <SavedAddresses addresses={mockAddresses} />
          </TabsContent> */}
        {/* </Tabs> */}
      </div>
    </div>
  );
}
