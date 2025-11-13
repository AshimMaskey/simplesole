import { NextResponse } from "next/server";
import { getWishlistCount } from "@/app/(users)/wishlist/actions/wishlist";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ count: 0 });

  const res = await getWishlistCount(userId);
  return NextResponse.json(res);
}
