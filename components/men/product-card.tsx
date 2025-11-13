"use client";

import { EyeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { MensProductProps } from "@/app/(users)/mens/mensClient";
import Link from "next/link";
import Image from "next/image";

interface ProductCardProps {
  product: MensProductProps;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative overflow-hidden bg-muted aspect-square">
        <Image
          width={400}
          height={400}
          src={product.images[0] || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      <CardContent className=" flex-1">
        <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {product.description}
        </p>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-foreground">
            ${product.base_price.toFixed(2)}
          </span>
        </div>
      </CardContent>

      <CardFooter>
        <Link href={`/products/${product.id}`}>
          <Button className="w-full gap-2">
            <EyeIcon className="h-4 w-4" />
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
