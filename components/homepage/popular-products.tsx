import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PopularProducts() {
  const products = [
    {
      name: "Velocity Pro",
      category: "Running",
      price: "$189",
      image: "/modern-running-shoe-product-shot-white-background.jpg",
      badge: "Best Seller",
    },
    {
      name: "Urban Classic",
      category: "Lifestyle",
      price: "$149",
      image: "/casual-sneaker-product-shot-white-background.jpg",
      badge: null,
    },
    {
      name: "Court Elite",
      category: "Basketball",
      price: "$199",
      image: "/basketball-shoe-product-shot-white-background.jpg",
      badge: "New",
    },
    {
      name: "Trail Master",
      category: "Outdoor",
      price: "$169",
      image: "/hiking-trail-shoe-product-shot-white-background.jpg",
      badge: null,
    },
  ];

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
          <Button variant="outline" className="hidden md:flex bg-transparent">
            View All Products
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <Card
              key={index}
              className="group cursor-pointer border-border hover:border-primary/50 transition-colors overflow-hidden"
            >
              <CardContent className="p-0">
                <div className="relative aspect-square bg-muted/50 overflow-hidden">
                  {product.badge && (
                    <div className="absolute top-3 left-3 z-10 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                      {product.badge}
                    </div>
                  )}
                  <Image
                    src={product.image || "/placeholder.svg"}
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
                    <span className="text-xl font-bold">{product.price}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    >
                      Add to Cart
                    </Button>
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
