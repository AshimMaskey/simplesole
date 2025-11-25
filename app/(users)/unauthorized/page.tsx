"use client";

import Link from "next/link";
import { Toaster, toast } from "react-hot-toast";
import { useEffect } from "react";

export default function UnauthorizedPage() {
  useEffect(() => {
    toast.error("You are not authorized to access this page");
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-100 text-center px-4">
      <h1 className="text-6xl font-bold text-red-600 mb-4">🚫 403</h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">
        You are not authorized
      </h2>
      <p className="text-gray-600 mb-6">
        Sorry, you don’t have permission to view this page.
      </p>
      <div className="flex gap-4">
        <Link
          href="/"
          className="px-6 py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition"
        >
          Go to Home
        </Link>
      </div>
      <Toaster position="top-center" />
    </div>
  );
}
