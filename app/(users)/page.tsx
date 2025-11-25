import BrandStory from "@/components/homepage/brand-story";
import FeaturedCollections from "@/components/homepage/featured-collections";
import Herosection from "@/components/homepage/herosection/Herosection";
import PopularProducts from "@/components/homepage/popular-products";
import { checkUser } from "@/lib/check-user";
import { getFeaturedProducts } from "../actions/homeActions";
import { getCompanySettings } from "../(admin)/settings/general/actions/settingActions";

const Home = async () => {
  const user = await checkUser();
  const products = await getFeaturedProducts();
  const companySettings = await getCompanySettings();
  return (
    <main>
      <Herosection companySettings={companySettings.data} />
      <FeaturedCollections />
      <BrandStory companySettings={companySettings.data} />
      <PopularProducts products={products} />
    </main>
  );
};

export default Home;
