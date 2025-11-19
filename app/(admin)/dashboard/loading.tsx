"use client";
import React from "react";
import { Card } from "@/components/ui/card";

const Loading = () => {
  const stats = Array(4).fill(null);

  return (
    <div className="space-y-8 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 w-48 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((_, idx) => (
          <Card
            key={idx}
            className="flex items-center p-4 rounded-lg shadow animate-pulse"
          >
            <div className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 h-12 w-12"></div>
            <div className="ml-4 flex-1 space-y-2">
              <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div className="h-6 w-12 bg-gray-300 dark:bg-gray-500 rounded"></div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-900 p-4 pb-6 rounded-lg shadow animate-pulse">
          <div className="h-6 w-40 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-4 pb-6 rounded-lg shadow animate-pulse">
          <div className="h-6 w-44 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
