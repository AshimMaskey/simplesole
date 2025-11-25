"use server";

import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

// export async function checkUser() {
//   const user = await currentUser();
//   if (!user) return null;

//   const email = user.emailAddresses[0]?.emailAddress ?? null;

//   const existingUser = await prisma.user.findUnique({
//     where: { id: user.id },
//   });

//   if (existingUser) return existingUser;

//   const newUser = await prisma.user.create({
//     data: {
//       id: user.id,
//       fullName:
//         user.fullName ?? `${user.firstName ?? ""} ${user.lastName ?? ""}`,
//       email,
//       image_url: user.imageUrl,
//       role: "USER",
//     },
//   });

//   return newUser;
// }

export async function checkUser() {
  const user = await currentUser();
  if (!user) return null;

  const newUser = await prisma.user.upsert({
    where: { id: user.id },
    update: {},
    create: {
      id: user.id,
      fullName:
        user.fullName ?? `${user.firstName ?? ""} ${user.lastName ?? ""}`,
      email: user.emailAddresses[0]?.emailAddress ?? null,
      image_url: user.imageUrl,
      role: "USER",
    },
  });

  return newUser;
}
