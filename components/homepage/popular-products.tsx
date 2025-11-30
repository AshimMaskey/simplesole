"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Eye } from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  base_price: number;
  images: string[];
}

interface PopularProductsProps {
  products: Product[];
}

export default function PopularProducts({ products }: PopularProductsProps) {
  return (
    <section className="py-24 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
              Popular Right Now
            </h2>
            <p className="text-lg text-muted-foreground text-pretty">
              Our most-loved styles, chosen by the community
            </p>
          </div>
          <Link href={"/shop"}>
            {" "}
            <Button variant="outline" className="hidden md:flex bg-transparent">
              View All Products
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <Card
              key={index}
              className="group cursor-pointer border-border hover:border-primary/50 transition-colors overflow-hidden"
            >
              <CardContent className="p-0">
                <div className="relative aspect-square bg-muted/50 overflow-hidden">
                  <Image
                    src={product.images[0] || "/product_placeholder.jpeg"}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    {product.category}
                  </p>
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold">
                      $ {product.base_price}
                    </span>
                    <Link href={`/products/${product.id}`}>
                      <Button
                        size="sm"
                        className=" bg-black text-white cursor-pointer"
                      >
                        <Eye />
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Button variant="outline" className="w-full sm:w-auto bg-transparent">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
}
