// "use client";
// import { SignedIn, UserButton } from "@clerk/nextjs";

// const ProfilePage = () => {
//   return (
//     <div>
//       <SignedIn>
//         <UserButton />
//       </SignedIn>
//     </div>
//   );
// };

// export default ProfilePage;
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileStats } from "@/components/profile/profile-stats";
import { OrderHistory } from "@/components/profile/order-history";
import { SavedAddresses } from "@/components/profile/saved-addresses";
import { mockUser, mockOrders, mockAddresses } from "@/lib/mock-profile-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProfilePage() {
  const totalSpent = mockOrders.reduce((sum, order) => sum + order.total, 0);
  const wishlistCount = 5; // Mock wishlist count

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <ProfileHeader user={mockUser} />

        <ProfileStats
          totalOrders={mockOrders.length}
          wishlistItems={wishlistCount}
          totalSpent={totalSpent}
        />

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-grid">
            <TabsTrigger value="orders">Order History</TabsTrigger>
            <TabsTrigger value="addresses">Addresses</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Order History</h2>
            </div>
            <OrderHistory orders={mockOrders} />
          </TabsContent>

          <TabsContent value="addresses">
            <SavedAddresses addresses={mockAddresses} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
