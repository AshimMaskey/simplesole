import { getProductsByAudience } from "@/app/actions/audienceActions";
import MensProductsPage from "../mens/mensClient";
import { Audience } from "@prisma/client";

const KidsPage = async () => {
  const bannerInfo = {
    title: "KIDS' COLLECTION",
    desc: "Fun and comfortable Footwear for little ones",
    imageUrl: "/kids.jpeg",
  };
  const products = await getProductsByAudience(Audience.KIDS);
  return <MensProductsPage bannerInfo={bannerInfo} products={products} />;
};

export default KidsPage;
