// // app/api/webhooks/clerk/route.ts

// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import { verifyWebhook } from "@clerk/nextjs/server";   // correct import

// const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET!;
// if (!CLERK_WEBHOOK_SECRET) {
//   throw new Error("CLERK_WEBHOOK_SECRET not set");
// }

// export async function POST(req: NextRequest) {
//   const rawBody = await req.text();
//   const signature = req.headers.get("clerk-signature");

//   if (!signature) {
//     return NextResponse.json({ ok: false, error: "Missing Clerk signature" }, { status: 400 });
//   }

//   let event;
//   try {
//     event = await verifyWebhook(req, {
//       secret: CLERK_WEBHOOK_SECRET,
//       // depending on version you may need: payload or rawBody
//     });
//   } catch (err) {
//     console.error("Webhook verification failed:", err);
//     return NextResponse.json({ ok: false, error: "Webhook verification failed" }, { status: 400 });
//   }

//   if (event.type === "user.created") {
//     const user = event.data;
//     const email = user.email_addresses?.[0]?.email_address;
//     if (!email) {
//       return NextResponse.json({ ok: false, error: "No email found" }, { status: 400 });
//     }

//     try {
//       await prisma.user.upsert({
//         where: { id: user.id },
//         update: {
//           fullName: user.full_name,
//           email,
//           image_url: user.profile_image_url,
//           updatedAt: new Date(),
//         },
//         create: {
//           id: user.id,
//           fullName: user.full_name || "",
//           email,
//           image_url: user.profile_image_url || null,
//           role: "USER",
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         },
//       });
//       return NextResponse.json({ ok: true });
//     } catch (err) {
//       console.error("Failed to insert user into DB:", err);
//       return NextResponse.json({ ok: false, error: "Failed to insert user into DB" }, { status: 500 });
//     }
//   }

//   return NextResponse.json({ ok: true });
// }
