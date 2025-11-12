"use server";

import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function syncUserToDB() {
  const user = await currentUser();
  if (!user) return;

  const email = user.emailAddresses[0]?.emailAddress ?? null;

  if (!email) return;

  await prisma.user.upsert({
    where: { id: user.id },
    update: {
      fullName: user.fullName || undefined,
      image_url: user.imageUrl || undefined,
      email,
      updatedAt: new Date(),
    },
    create: {
      id: user.id,
      fullName: user.fullName || "",
      image_url: user.imageUrl || null,
      email,
      role: "USER",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
}
