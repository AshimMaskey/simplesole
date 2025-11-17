import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  context: { params: { userId: string } }
) {
  try {
    const { params } = context;
    const userId = params.userId;
    // console.log(userId);

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const totalOrders = await prisma.order.count({
      where: { userId },
    });

    return NextResponse.json({
      totalOrders,
    });
  } catch (error) {
    console.error("Error fetching total orders:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
