// "use server";

// import { currentUser } from "@clerk/nextjs/server";
// import prisma from "@/lib/prisma";

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

// export async function checkUser() {
//   const user = await currentUser();
//   if (!user) return null;

//   const newUser = await prisma.user.upsert({
//     where: { id: user.id },
//     update: {},
//     create: {
//       id: user.id,
//       fullName:
//         user.fullName ?? `${user.firstName ?? ""} ${user.lastName ?? ""}`,
//       email: user.emailAddresses[0]?.emailAddress ?? null,
//       image_url: user.imageUrl,
//       role: "USER",
//     },
//   });

//   return newUser;
// }

"use server";

import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function checkUser() {
  const user = await currentUser();
  if (!user) return null;

  try {
    // First, try to find the user
    const existingUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (existingUser) {
      return existingUser;
    }

    // If user doesn't exist, try to create with a unique constraint error handler
    try {
      const newUser = await prisma.user.create({
        data: {
          id: user.id,
          fullName:
            user.fullName ??
            (`${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || null),
          email: user.emailAddresses[0]?.emailAddress ?? null,
          image_url: user.imageUrl,
          role: "USER",
        },
      });
      return newUser;
    } catch (createError: any) {
      // If the error is because the user already exists (race condition)
      if (createError.code === "P2002") {
        // Try to fetch the user again
        const raceConditionUser = await prisma.user.findUnique({
          where: { id: user.id },
        });
        if (raceConditionUser) {
          return raceConditionUser;
        }
      }
      throw createError; // Re-throw if it's a different error
    }
  } catch (error) {
    console.error("Error in checkUser:", error);
    throw error;
  }
}
