import Link from "next/link";
import { getOrderDetails } from "@/app/actions/order";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { currentUser } from "@clerk/nextjs/server";

async function getCurrentUser() {
  const user = await currentUser();
  return { id: user?.id || "dummy", email: user?.primaryEmailAddress };
}

export default async function OrderSuccessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  const { id } = await params;

  let order = null;
  let error = null;
  try {
    order = await getOrderDetails(id, user.id);
    console.log(order);
  } catch (err) {
    error = err instanceof Error ? err.message : "Order not found";
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="max-w-md w-full border-destructive">
          <CardContent className="pt-6 text-center">
            <div className="text-5xl mb-4">❌</div>
            <h1 className="text-2xl font-bold mb-2">Error</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Link href="/">
              <Button variant="outline" className="w-full">
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <Card className="border-green-200 bg-green-50 mb-6">
          <CardContent className="pt-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground mb-4">
              Thank you for your purchase. Your order has been successfully
              placed.
            </p>
            <p className="text-2xl font-bold text-green-600">
              Order ID: {order?.id.slice(0, 8).toUpperCase()}
            </p>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between pb-2 border-b">
              <span className="text-muted-foreground">Order Total</span>
              <span className="font-bold text-lg">
                Rs. {order?.total.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between pb-2 border-b">
              <span className="text-muted-foreground">Payment Method</span>
              <span className="font-semibold">{order?.paymentMethod}</span>
            </div>
            <div className="flex justify-between pb-2">
              <span className="text-muted-foreground">Status</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                {order?.status}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Items Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Items ({order?.orderItems?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {order?.orderItems?.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center pb-3 border-b last:border-0"
                >
                  <div>
                    <p className="font-medium">{item.variant.product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.variant.color} - {item.variant.size} x{" "}
                      {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">
                    Rs. {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* What's Next */}
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg">What&apos;s Next?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              A confirmation email will be sent to{" "}
              <strong>{order?.user?.email}</strong>
            </p>
            <p>Your order will be delivered to:</p>
            <p className="whitespace-pre-wrap text-muted-foreground">
              {order?.shippingAddress}
            </p>
            <p className="text-muted-foreground">Contact: {order?.phone}</p>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/orders" className="w-full">
            <Button className="w-full">View All Orders</Button>
          </Link>
          <Link href="/" className="w-full">
            <Button variant="outline" className="w-full">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// import Link from "next/link";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { currentUser } from "@clerk/nextjs/server";
// import { getBasicOrder } from "@/app/actions/order"; // your lightweight function

// async function getCurrentUser() {
//   const user = await currentUser();
//   return { id: user?.id || "dummy", email: user?.primaryEmailAddress };
// }

// export default async function OrderSuccessPage({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   const { id } = await params;
//   const user = await getCurrentUser();

//   let order = null;
//   let error = null;

//   try {
//     // Lightweight verification
//     order = await getBasicOrder(id, user.id);
//   } catch (err) {
//     error = err instanceof Error ? err.message : "Order not found";
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center px-4">
//         <Card className="max-w-md w-full border-destructive">
//           <CardContent className="pt-6 text-center">
//             <div className="text-5xl mb-4">❌</div>
//             <h1 className="text-2xl font-bold mb-2">Error</h1>
//             <p className="text-muted-foreground mb-6">{error}</p>
//             <Link href="/">
//               <Button variant="outline" className="w-full">
//                 Back to Home
//               </Button>
//             </Link>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
//       <div className="max-w-md w-full">
//         {/* Success Card */}
//         <Card className="border-green-200 bg-green-50 mb-6">
//           <CardContent className="pt-6 text-center">
//             <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
//               <svg
//                 className="w-8 h-8 text-green-600"
//                 fill="currentColor"
//                 viewBox="0 0 20 20"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//             </div>

//             <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
//             <p className="text-muted-foreground mb-4">
//               Thank you for your purchase. Your order has been successfully
//               placed.
//             </p>

//             <p className="text-2xl font-bold text-green-600">
//               Order ID: {order?.id.slice(0, 8).toUpperCase()}
//             </p>
//           </CardContent>
//         </Card>

//         {/* Action Buttons */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           <Link href="/orders" className="w-full">
//             <Button className="w-full">View All Orders</Button>
//           </Link>
//           <Link href="/" className="w-full">
//             <Button variant="outline" className="w-full">
//               Continue Shopping
//             </Button>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }
