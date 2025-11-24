"use server";

import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";

export interface CompanySettingData {
  logo_url?: string | null;
  company_name: string;
}

export async function getCompanySettings() {
  try {
    let settings = await prisma.companySetting.findFirst();
    if (!settings) {
      settings = await prisma.companySetting.create({
        data: {
          company_name: "SoleMate",
          logo_url: "/logo.png",
        },
      });
    }

    return { success: true, data: settings };
  } catch (error) {
    console.error("[v0] Error fetching company settings:", error);
    return { success: false, error: "Failed to fetch settings" };
  }
}

export async function updateCompanySettings(data: CompanySettingData) {
  try {
    const settings = await prisma.companySetting.updateMany({
      data: {
        logo_url: data.logo_url,
        company_name: data.company_name,
      },
    });

    revalidateTag("company-settings");
    return { success: true, data: settings };
  } catch (error) {
    console.error("[v0] Error updating company settings:", error);
    return { success: false, error: "Failed to update settings" };
  }
}

export async function generateCloudinarySignature(
  timestamp: number
): Promise<{ signature: string; timestamp: number }> {
  return { signature: "", timestamp };
}
