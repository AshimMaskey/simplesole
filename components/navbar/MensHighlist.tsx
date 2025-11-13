"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import { Product } from "@/types/product";

interface HighlightProps {
  audience: "MENS" | "WOMENS" | "KIDS";
}

export default function Highlight({ audience }: HighlightProps) {
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetch(`/api/random?audience=${audience}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch(console.error);
  }, [audience]);

  if (!product)
    return (
      <div className="border rounded-xl p-3 flex items-center gap-3 animate-pulse">
        <Skeleton className="h-16 w-16 rounded-md" />

        <div className="flex flex-col flex-1 gap-2">
          <Skeleton className="h-4 w-3/4 rounded" />
          <Skeleton className="h-3 w-full rounded" />
        </div>
      </div>
    );

  return (
    <div className="border rounded-xl p-3 flex items-center gap-3 hover:bg-muted/40 transition">
      <Image
        src={product.images[0]}
        alt={product.name}
        width={70}
        height={70}
        className="rounded-md object-cover"
      />
      <div className="flex flex-col">
        <Link
          href={`/products/${product.id}`}
          className="font-medium hover:underline"
        >
          {product.name}
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description || "Stylish and comfortable product."}
        </p>
      </div>
    </div>
  );
}
