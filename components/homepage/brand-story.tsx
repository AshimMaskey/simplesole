import BrandStoryClient from "./BrandStoryClient";
import {
  getBrandStoryFeatures,
  type BrandStoryFeature,
} from "@/app/actions/brand-story";

export default async function BrandStoryServer() {
  const features: BrandStoryFeature[] = await getBrandStoryFeatures();

  return <BrandStoryClient features={features} />;
}
