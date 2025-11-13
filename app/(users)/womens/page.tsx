import { getMensProducts } from "@/app/actions/audienceActions";
import MensProductsPage from "../mens/mensClient";

const WomensPage = async () => {
  const bannerInfo = {
    title: "WOMEN'S COLLECTION",
    desc: "Elegant and trendy Footwear for every occasion",
    imageUrl: "/womens.jpeg",
  };
  const products = await getMensProducts("WOMENS");
  return <MensProductsPage bannerInfo={bannerInfo} products={products} />;
};

export default WomensPage;
