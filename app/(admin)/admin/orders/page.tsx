import { getAllOrders } from "@/app/actions/order";
import AdminOrdersList from "./admin-order-lists";
import { currentUser } from "@clerk/nextjs/server";
import { checkIsAdmin } from "../../users/actions/userActions";

export default async function AdminOrdersPage() {
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

  const orders = await getAllOrders(isAdmin ? "ADMIN" : "NOTADMIN");

  return (
    <div className="bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl mb-3 font-semibold">Order Management</h1>
        <p className="text-muted-foreground mb-3">
          Manage and view all orders in your ecommerce shoe store
        </p>
        <AdminOrdersList orders={orders} />
      </div>
    </div>
  );
}
