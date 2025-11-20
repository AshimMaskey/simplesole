import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST() {
  await prisma.review.updateMany({
    where: { seen: false },
    data: { seen: true },
  });
  return NextResponse.json({ success: true });
}
