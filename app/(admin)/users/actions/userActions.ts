"use server";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export const getAllUsers = async () => {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized: Not signed in");
  }
  const nowUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!nowUser || nowUser.role !== "ADMIN") {
    throw new Error("Forbidden: Admins only");
  }

  const users = await prisma.user.findMany({
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
  return users;
};

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

  return updatedUser;
}
