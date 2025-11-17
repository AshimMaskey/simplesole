import { NextResponse } from "next/server";
import { getUserOrders } from "@/app/actions/order";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId;

  const orders = await getUserOrders(userId);
  return NextResponse.json(orders);
}
