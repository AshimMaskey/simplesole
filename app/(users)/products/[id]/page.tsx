import { getProductById } from "../actions/products";
import { getReviewsByProduct } from "../actions/reviews";
import ImageGallery from "./ImageGallery";
import TabsSection from "./TabsSection";

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await getProductById(id);

  // const reviews = await getReviewsByProduct(id);
  const reviews = [];

  if (!product) {
    return (
      <div className="p-10 text-center text-red-500 text-xl">
        Product not found.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 flex flex-col gap-12">
      {/* Top Section: Image + Product Info */}
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

          <button className="bg-black text-white px-6 py-3 rounded-lg hover:opacity-80 transition">
            Add to Cart
          </button>
        </div>
      </div>

      {/* Full Width Tabs Section */}
      <div className="w-full">
        <TabsSection description={product.description} reviews={reviews} />
      </div>
    </div>
  );
}
