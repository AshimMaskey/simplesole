import AdminOrderDetailsView from "./admin-order-details-view";
import { currentUser } from "@clerk/nextjs/server";
import { checkIsAdmin } from "@/app/(admin)/users/actions/userActions";

export default async function AdminOrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await currentUser();
  const userId = user?.id;

  const isAdmin = await checkIsAdmin(userId || "bla bla");

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <p className="text-red-600">Unauthorized access</p>
        </div>
      </div>
    );
  }

  const { id } = await params;

  try {
    const orders = await getAllOrders(isAdmin ? "ADMIN" : "NOTADMIN");
    const order = orders.find((o) => o.id === id);

    if (!order) {
      throw new Error("Order not found");
    }

    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Order Details</h1>
          <AdminOrderDetailsView
            order={order}
            userRole={isAdmin ? "ADMIN" : "NOTADMIN"}
          />
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <p className="text-red-600">
            {error instanceof Error ? error.message : "Failed to load order"}
          </p>
        </div>
      </div>
    );
  }
}

async function getAllOrders(role: string) {
  const { getAllOrders: fn } = await import("@/app/actions/order");
  return fn(role);
}
