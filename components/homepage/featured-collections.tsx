import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function FeaturedCollections() {
  const collections = [
    {
      title: "Performance",
      description: "Engineered for athletes",
      image: "/athletic-performance-running-shoes-on-track.jpg",
      href: "/collections/performance",
    },
    {
      title: "Lifestyle",
      description: "Everyday comfort meets style",
      image: "/stylish-casual-lifestyle-sneakers-urban-setting.jpg",
      href: "/collections/lifestyle",
    },
    {
      title: "Limited Edition",
      description: "Exclusive drops",
      image: "/premium-limited-edition-designer-sneakers-luxury.jpg",
      href: "/collections/limited",
    },
  ];

  return (
    <section className="py-24 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
            Explore Collections
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Discover footwear designed for every moment, from peak performance
            to everyday style
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {collections.map((collection, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-lg aspect-[4/5] cursor-pointer"
            >
              <Image
                src={collection.image || "/placeholder.svg"}
                alt={collection.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{collection.title}</h3>
                <p className="text-sm text-white/80 mb-4">
                  {collection.description}
                </p>
                <Button
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white hover:text-black backdrop-blur-sm"
                >
                  Shop Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
