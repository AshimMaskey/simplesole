"use client";

import React from "react";

const ProductSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto mt-12 px-3 mb-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse border rounded-lg overflow-hidden bg-white dark:bg-muted"
        >
          <div className="h-48 bg-gray-200 dark:bg-gray-700 w-full"></div>
          <div className="p-4 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mt-2"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductSkeleton;
