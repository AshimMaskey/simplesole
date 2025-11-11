"use client";

import Image from "next/image";
import { useState } from "react";

export default function ImageGallery({ images }: { images: string[] }) {
  const [mainImage, setMainImage] = useState(images[0]);

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Main Image */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[3/2] md:aspect-[16/10] lg:aspect-[16/9] rounded-xl overflow-hidden">
        <Image
          src={mainImage || "/placeholder.png"}
          fill
          alt="Main product image"
          className="object-cover transition-transform duration-200 hover:scale-105 cursor-pointer"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
          priority
        />
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-auto py-2">
        {images.map((img, i) => (
          <button
            key={i}
            className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
              mainImage === img
                ? "border-blue-500 ring-2 ring-blue-200"
                : "border-transparent hover:border-gray-300"
            }`}
            onClick={() => setMainImage(img)}
            aria-label={`View image ${i + 1}`}
          >
            <Image
              src={img}
              alt={`Thumbnail ${i + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 64px, (max-width: 768px) 80px, 96px"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
