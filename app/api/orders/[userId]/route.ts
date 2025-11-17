import { NextResponse } from "next/server";
import { getUserOrders } from "@/app/actions/order";

export async function GET(
  req: Request,
  context: { params: { userId: string } }
) {
  const { params } = context;
  const userId = params.userId;

  const orders = await getUserOrders(userId);
  return NextResponse.json(orders);
}
