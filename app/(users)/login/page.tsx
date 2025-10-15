"use client";
import { SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import Image from "next/image";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <SignedOut>
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 text-center border border-gray-100">
          <div className="mb-6">
            <div className="flex items-center justify-center">
              <Image src={"/logo.png"} alt="logo" width={80} height={0} />
              <h1 className="text-3xl mt-2 font-semibold text-gray-800 mb-2">
                SoleMate
              </h1>
            </div>

            <p className="text-gray-500 text-sm">
              Sign in to continue to your account
            </p>
          </div>

          <div className="mb-4">
            <SignInButton forceRedirectUrl="/profile" mode="modal">
              <button className="w-full bg-indigo-600 cursor-pointer text-white rounded-full font-medium text-base py-3 hover:bg-indigo-700 transition">
                Sign In
              </button>
            </SignInButton>
          </div>

          <div className="flex items-center justify-center my-4">
            <div className="border-t border-gray-300 w-1/4"></div>
            <span className="mx-2 text-gray-400 text-sm">or</span>
            <div className="border-t border-gray-300 w-1/4"></div>
          </div>

          <SignUpButton mode="modal">
            <button className="w-full bg-white border cursor-pointer border-indigo-500 text-indigo-600 rounded-full font-medium text-base py-3 hover:bg-indigo-50 transition">
              Create an Account
            </button>
          </SignUpButton>

          <p className="mt-6 text-xs text-gray-400">
            By continuing, you agree to our{" "}
            <span className="text-indigo-500 hover:underline cursor-pointer">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="text-indigo-500 hover:underline cursor-pointer">
              Privacy Policy
            </span>
            .
          </p>
        </div>
      </SignedOut>
    </div>
  );
};

export default LoginPage;
