import { redirect } from "next/navigation";
import CheckoutForm from "./checkout-form";
import CheckoutSummary from "./checkout-summary";
import { currentUser } from "@clerk/nextjs/server";

async function getCurrentUser() {
  const user = await currentUser();
  return user?.id;
}

export default async function CheckoutPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main checkout form */}
          <div className="lg:col-span-2">
            <CheckoutForm userId={user} />
          </div>

          {/* Order summary sidebar */}
          <div className="lg:col-span-1">
            <CheckoutSummary userId={user} />
          </div>
        </div>
      </div>
    </div>
  );
}
