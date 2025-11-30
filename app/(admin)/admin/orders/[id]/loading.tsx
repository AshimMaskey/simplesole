"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminOrderDetailsSkeleton() {
  return (
    <div className="space-y-6 p-6 md:p-15 animate-pulse">
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="h-5 w-1/3 bg-gray-300 rounded"></CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row items-end gap-4">
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
              <div className="h-6 w-1/3 bg-gray-300 rounded"></div>
            </div>
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
              <div className="h-6 w-1/3 bg-gray-300 rounded"></div>
            </div>
            <div className="h-10 w-32 bg-gray-300 rounded"></div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="h-5 w-1/4 bg-gray-300 rounded"></CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
          <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
          <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
          <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="h-5 w-1/4 bg-gray-300 rounded"></CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-4 pb-4 border-b last:border-0">
              <div className="h-20 w-20 bg-gray-300 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
                <div className="h-3 w-1/3 bg-gray-300 rounded"></div>
                <div className="h-3 w-1/3 bg-gray-300 rounded"></div>
                <div className="h-3 w-1/4 bg-gray-300 rounded"></div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="h-4 w-12 bg-gray-300 rounded"></div>
                <div className="h-3 w-6 bg-gray-300 rounded"></div>
                <div className="h-4 w-14 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="h-5 w-1/3 bg-gray-300 rounded"></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-16 bg-gray-300 rounded"></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="h-5 w-1/3 bg-gray-300 rounded"></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-16 bg-gray-300 rounded"></div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="h-5 w-1/3 bg-gray-300 rounded"></CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-4 w-full bg-gray-300 rounded"></div>
          ))}
          <div className="h-6 w-1/3 bg-gray-300 rounded mt-2"></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="h-5 w-1/3 bg-gray-300 rounded"></CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-4 w-1/4 bg-gray-300 rounded"></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="h-5 w-1/4 bg-gray-300 rounded"></CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-12 bg-gray-300 rounded"></div>
        </CardContent>
      </Card>
    </div>
  );
}
