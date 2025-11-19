"use server";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidateTag, unstable_cache } from "next/cache";

const _getAllUsers = unstable_cache(
  async () => {
    console.log("📡 Fetching from DB...");
    return prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        phone: true,
        createdAt: true,
      },
    });
  },
  ["users"],
  {
    revalidate: 3600,
    tags: ["users"],
  }
);

export async function getAllUsers() {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const nowUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!nowUser || nowUser.role !== "ADMIN") {
    throw new Error("Forbidden: Admins only");
  }

  return _getAllUsers();
}

export async function updateUser(
  targetUserId: string,
  updates: { fullName?: string; phone?: string; role?: "USER" | "ADMIN" }
) {
  const user = await currentUser();

  if (!user) throw new Error("Unauthorized: You must be logged in.");

  const nowUser = await prisma.user.findUnique({ where: { id: user.id } });

  if (!nowUser || nowUser.role !== "ADMIN") {
    throw new Error("Forbidden: Only admins can update users.");
  }

  // Prevent admin from demoting themselves
  if (nowUser.id === targetUserId && updates.role && updates.role !== "ADMIN") {
    throw new Error("You cannot change your own role.");
  }

  const updatedUser = await prisma.user.update({
    where: { id: targetUserId },
    data: updates,
  });
  revalidateTag("users");

  return updatedUser;
}

export async function checkIsAdmin(userId: string) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user.role === "ADMIN";
}
