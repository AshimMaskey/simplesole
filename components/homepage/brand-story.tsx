import BrandStoryClient from "./BrandStoryClient";
import {
  getBrandStoryFeatures,
  type BrandStoryFeature,
} from "@/app/actions/brand-story";

interface CompanySetting {
  id: string;
  logo_url: string | null;
  company_name: string;
}

export default async function BrandStoryServer({
  companySettings,
}: {
  companySettings?: CompanySetting;
}) {
  const features: BrandStoryFeature[] = await getBrandStoryFeatures();

  return (
    <BrandStoryClient
      companyName={companySettings?.company_name || "Our Store"}
      features={features}
    />
  );
}
