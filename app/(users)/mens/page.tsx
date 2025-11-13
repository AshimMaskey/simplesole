import { getProductsByAudience } from "@/app/actions/audienceActions";
import MensProductsPage from "./mensClient";
import { Audience } from "@prisma/client";

const MensPage = async () => {
  const bannerInfo = {
    title: "MEN'S COLLECTION",
    desc: "Premimum Footwear for every occassion",
    imageUrl: "/mens.jpeg",
  };
  const products = await getProductsByAudience(Audience.MENS);
  return <MensProductsPage bannerInfo={bannerInfo} products={products} />;
};

export default MensPage;
