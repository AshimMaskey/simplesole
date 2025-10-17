// "use client";
// import {
//   SignedIn,
//   SignedOut,
//   SignInButton,
//   SignUpButton,
//   UserButton,
//   useUser,
// } from "@clerk/nextjs";
// import { useEffect } from "react";
// import { syncUserToDB } from "./actions/userActions";

// const Home = () => {
//   const { isSignedIn } = useUser();

//   useEffect(() => {
//     if (isSignedIn) {
//       syncUserToDB();
//     }
//   }, [isSignedIn]);
//   return (
//     <>
//       <div className="flex items-center gap-4">
//         <SignedOut>
//           <div className="flex items-center gap-3">
//             <SignInButton>
//               <button className="px-5 py-2 sm:px-6 sm:py-2.5 text-sm sm:text-base font-medium text-gray-700 border border-gray-300 rounded-full hover:bg-gray-100 transition">
//                 Sign In
//               </button>
//             </SignInButton>
//             <SignUpButton>
//               <button className="px-5 py-2 sm:px-6 sm:py-2.5 text-sm sm:text-base font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full shadow-md hover:shadow-lg hover:from-indigo-600 hover:to-purple-700 transition-all">
//                 Sign Up
//               </button>
//             </SignUpButton>
//           </div>
//         </SignedOut>

//         <SignedIn>
//           <div className="flex items-center gap-3">
//             <UserButton afterSignOutUrl="/" />
//           </div>
//         </SignedIn>
//       </div>
//     </>
//   );
// };

// export default Home;

import BrandStory from "@/components/homepage/brand-story";
import FeaturedCollections from "@/components/homepage/featured-collections";
import Herosection from "@/components/homepage/herosection/Herosection";
import PopularProducts from "@/components/homepage/popular-products";
import React from "react";

const Home = () => {
  return (
    <main>
      <Herosection />
      <FeaturedCollections />
      <BrandStory />
      <PopularProducts />
    </main>
  );
};

export default Home;
