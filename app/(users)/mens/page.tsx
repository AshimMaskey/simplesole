import { getMensProducts } from "@/app/actions/audienceActions";
import MensProductsPage from "./mensClient";

const MensPage = async () => {
  const bannerInfo = {
    title: "MEN'S COLLECTION",
    desc: "Premimum Footwear for every occassion",
    imageUrl: "/mens.jpeg",
  };
  const products = await getMensProducts("MENS");
  return <MensProductsPage bannerInfo={bannerInfo} products={products} />;
};

export default MensPage;
