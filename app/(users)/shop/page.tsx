import { getProducts } from "./actions/productActions";
import ShopClient from "./shop-client";

export default async function ShopPage() {
  const products = await getProducts();
  console.log(products);

  return <ShopClient initialProducts={products} />;
}
