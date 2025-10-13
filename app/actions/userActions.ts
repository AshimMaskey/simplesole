"use server";

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function syncUserToDB() {
  const user = await currentUser();
  if (!user) return;

  // Check if user exists in DB
  const existing = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!existing) {
    await prisma.user.create({
      data: {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        fullName: user.fullName || "",
        image_url: user.imageUrl,
        role: "USER",
      },
    });
  }
}
