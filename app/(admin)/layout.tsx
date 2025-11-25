import { redirect } from "next/navigation";
import { checkIsAdmin } from "./users/actions/userActions";
import AdminLayoutContent from "@/components/admin/admin-layout-content";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { auth } from "@clerk/nextjs/server";
import { ReviewProvider } from "@/contexts/ReviewContext";
import { SidebarProvider } from "@/components/sidebar/sidebar-context";
import "@/app/globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const isAdmin = await checkIsAdmin(userId || "fallback");
  if (!isAdmin) redirect("/unauthorized");

  return (
    <ClerkProvider
      // signInUrl="/signin"
      // signUpUrl="/signup"
      // afterSignOutUrl="/"
      signInUrl="/login"
      signUpUrl="/login"
      afterSignInUrl={"/"}
      afterSignOutUrl="/"
    >
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <SidebarProvider>
            <ReviewProvider>
              <AdminLayoutContent>{children}</AdminLayoutContent>
            </ReviewProvider>
          </SidebarProvider>

          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
