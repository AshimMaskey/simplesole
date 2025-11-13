import BrandStory from "@/components/homepage/brand-story";
import FeaturedCollections from "@/components/homepage/featured-collections";
import Herosection from "@/components/homepage/herosection/Herosection";
import PopularProducts from "@/components/homepage/popular-products";
import { checkUser } from "@/lib/check-user";
import { getFeaturedProducts } from "../actions/homeActions";

const Home = async () => {
  const user = await checkUser();
  const products = await getFeaturedProducts();
  return (
    <main>
      <Herosection />
      <FeaturedCollections />
      <BrandStory />
      <PopularProducts products={products} />
    </main>
  );
};

export default Home;
