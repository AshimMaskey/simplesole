import { redirect } from "next/navigation";
import { getOrderDetails } from "@/app/actions/order";
import OrderDetailsView from "./order-details-view";
import { currentUser } from "@clerk/nextjs/server";

async function getCurrentUser() {
  const user = await currentUser();
  return {
    id: user?.id || "user-123",
    email: user?.primaryEmailAddress || "user@example.com",
  };
}

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { id } = await params;

  try {
    const order = await getOrderDetails(id, user.id);

    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Order Details</h1>
          <OrderDetailsView order={order} />
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <p className="text-red-600">
            {error instanceof Error ? error.message : "Failed to load order"}
          </p>
        </div>
      </div>
    );
  }
}
