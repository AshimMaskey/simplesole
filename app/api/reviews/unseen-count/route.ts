import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const GET = async () => {
  const count = await prisma.review.count({
    where: { seen: false },
  });

  return NextResponse.json({ count });
};
