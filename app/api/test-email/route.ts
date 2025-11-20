import { sendEmail } from "@/lib/email";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
  try {
    await sendEmail(
      "ashimmaskey4@gmail.com",
      "Test Email from Next.js",
      "Hello! This is a test email from Nodemailer."
    );
    return NextResponse.json({ success: true, message: "Email sent!" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      success: false,
      message: "Failed to send email.",
    });
  }
}
