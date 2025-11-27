import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();
    if (!name) throw new Error("Category name is required");

    const category = await prisma.category.create({ data: { name } });
    return NextResponse.json({ success: true, category });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: (error as Error).message,
    });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, name } = await req.json();
    if (!id || !name) throw new Error("Category ID and name are required");

    const category = await prisma.category.update({
      where: { id },
      data: { name },
    });
    return NextResponse.json({ success: true, category });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: (error as Error).message,
    });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) throw new Error("Category ID is required");

    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: (error as Error).message,
    });
  }
}

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json([]);
  }
}
