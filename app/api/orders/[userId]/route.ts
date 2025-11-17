import { NextResponse } from "next/server";
import { getUserOrders } from "@/app/actions/order";

export async function GET(
  req: Request,
  context: { params: Promise<{ userId: string }> }
) {
  const { userId } = await context.params;

  const orders = await getUserOrders(userId);
  return NextResponse.json(orders);
}
