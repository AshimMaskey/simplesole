import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const audience = searchParams.get("audience") || "MENS";

  const products = await prisma.product.findMany({
    where: { audience: audience as "MENS" | "WOMENS" | "KIDS" },
    select: {
      id: true,
      name: true,
      description: true,
      images: true,
    },
    orderBy: {
      created_at: "desc",
    },
    take: 1,
  });

  return NextResponse.json(products[0] ?? null);
}
