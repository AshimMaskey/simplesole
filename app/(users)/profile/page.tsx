"use client";
import { SignedIn, UserButton } from "@clerk/nextjs";

const ProfilePage = () => {
  return (
    <div>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
};

export default ProfilePage;
