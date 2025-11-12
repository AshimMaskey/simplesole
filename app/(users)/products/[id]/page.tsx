import { ChevronLeft, Heart } from "lucide-react";
import { getProductById } from "../actions/products";
import { getReviewsByProduct } from "../actions/reviews";
import ImageGallery from "./ImageGallery";
import TabsSection from "./TabsSection";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import WishlistButton from "@/components/wishlist/WishlistButton";

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await getProductById(id);

  const reviews = await getReviewsByProduct(id);

  if (!product) {
    return (
      <div className="p-10 text-center text-red-500 text-xl">
        Product not found.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 flex flex-col">
      {/* Top Section: Image + Product Info */}
      <Button className="flex justify-start" variant={"link"}>
        <Link href={"/shop"}>
          <div className="mb-3 flex items-center pl-0 text-gray-500">
            <ChevronLeft className="w-4 h-4" />
            <p>Continue Shopping</p>
          </div>
        </Link>
      </Button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="w-full">
          <ImageGallery images={product.images} />
        </div>

        <div className="flex flex-col gap-6">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-600">{product.description}</p>
          <div className="text-2xl font-semibold">Rs. {product.base_price}</div>

          <div>
            <h3 className="font-semibold mb-2">Available Variants:-</h3>
            <div className="flex gap-3 overflow-x-auto py-2">
              {product.variants.length === 0 ? (
                <div>
                  <h1 className="text-red-500">No Variants! :(</h1>
                </div>
              ) : null}
              {product.variants.map((v) => (
                <div
                  key={v.id}
                  className="min-w-[140px] border rounded-lg p-3 shadow-sm bg-gray-50 flex-shrink-0 flex flex-col gap-1"
                >
                  <div className="font-medium text-gray-800">
                    Size: {v.size}
                  </div>
                  <div className="font-medium text-gray-800">
                    Color: {v.color}
                  </div>
                  <div className="text-sm text-gray-500">Stock: {v.stock}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full flex items-center gap-3">
            <button className="bg-black cursor-pointer flex-1 text-white px-6 py-3 rounded-lg hover:opacity-80 transition">
              Add to Cart
            </button>
            <WishlistButton productId={product.id} />
          </div>
        </div>
      </div>

      {/* Full Width Tabs Section */}
      <div className="w-full">
        <TabsSection
          description={product.description}
          reviews={reviews}
          productId={product.id}
        />
      </div>
    </div>
  );
}
