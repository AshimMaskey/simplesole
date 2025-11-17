import { redirect } from "next/navigation";
import { getUserOrders } from "@/app/actions/order";
import OrdersList from "./orders-list";
import { currentUser } from "@clerk/nextjs/server";

async function getCurrentUser() {
  const user = await currentUser();
  return {
    id: user?.id || "user-123",
    email: user?.primaryEmailAddress || "user@example.com",
  };
}

export default async function OrdersPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const orders = await getUserOrders(user.id);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No orders yet</p>
          </div>
        ) : (
          <OrdersList orders={orders} />
        )}
      </div>
    </div>
  );
}
