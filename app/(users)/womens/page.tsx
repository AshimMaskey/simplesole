import { getProductsByAudience } from "@/app/actions/audienceActions";
import MensProductsPage from "../mens/mensClient";
import { Audience } from "@prisma/client";

const WomensPage = async () => {
  const bannerInfo = {
    title: "WOMEN'S COLLECTION",
    desc: "Elegant and trendy Footwear for every occasion",
    imageUrl: "/womens.jpeg",
  };
  const products = await getProductsByAudience(Audience.WOMENS);
  return <MensProductsPage bannerInfo={bannerInfo} products={products} />;
};

export default WomensPage;
