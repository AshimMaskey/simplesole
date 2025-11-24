"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type FooterSection = {
  id: string;
  title: string;
  description: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

export type FooterLink = {
  id: string;
  label: string;
  href: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

export type FooterSocialLink = {
  id: string;
  name: string;
  href: string;
  icon: string;
  order: number;
};

export type FooterInfo = {
  id: string;
  companyName: string;
  description: string;
  copyrightText: string;
  updatedAt: Date;
};

// Footer Section Actions
export async function getFooterSections(): Promise<FooterSection[]> {
  try {
    const sections = await prisma.footerSection.findMany({
      orderBy: { order: "asc" },
    });
    return sections;
  } catch (error) {
    console.error("Error fetching footer sections:", error);
    throw new Error("Failed to fetch footer sections");
  }
}

export async function createFooterSection(data: {
  title: string;
  description: string;
  order?: number;
}): Promise<FooterSection> {
  try {
    const section = await prisma.footerSection.create({
      data: {
        title: data.title,
        description: data.description,
        order: data.order || 0,
      },
    });
    revalidatePath("/admin/footer");
    revalidatePath("/");
    return section;
  } catch (error) {
    console.error("Error creating footer section:", error);
    throw new Error("Failed to create footer section");
  }
}

export async function updateFooterSection(
  id: string,
  data: { title?: string; description?: string; order?: number }
): Promise<FooterSection> {
  try {
    const section = await prisma.footerSection.update({
      where: { id },
      data,
    });
    revalidatePath("/admin/footer");
    revalidatePath("/");
    return section;
  } catch (error) {
    console.error("Error updating footer section:", error);
    throw new Error("Failed to update footer section");
  }
}

export async function deleteFooterSection(id: string): Promise<void> {
  try {
    await prisma.footerSection.delete({
      where: { id },
    });
    revalidatePath("/admin/footer");
    revalidatePath("/");
  } catch (error) {
    console.error("Error deleting footer section:", error);
    throw new Error("Failed to delete footer section");
  }
}

// Footer Link Actions
export async function getFooterLinks(): Promise<FooterLink[]> {
  try {
    const links = await prisma.footerLink.findMany({
      orderBy: { order: "asc" },
    });
    return links;
  } catch (error) {
    console.error("Error fetching footer links:", error);
    throw new Error("Failed to fetch footer links");
  }
}

export async function createFooterLink(data: {
  label: string;
  href: string;
  order?: number;
}): Promise<FooterLink> {
  try {
    const link = await prisma.footerLink.create({
      data,
    });
    revalidatePath("/admin/footer");
    revalidatePath("/");
    return link;
  } catch (error) {
    console.error("Error creating footer link:", error);
    throw new Error("Failed to create footer link");
  }
}

export async function updateFooterLink(
  id: string,
  data: { label?: string; href?: string; order?: number }
): Promise<FooterLink> {
  try {
    const link = await prisma.footerLink.update({
      where: { id },
      data,
    });
    revalidatePath("/admin/footer");
    revalidatePath("/");
    return link;
  } catch (error) {
    console.error("Error updating footer link:", error);
    throw new Error("Failed to update footer link");
  }
}

export async function deleteFooterLink(id: string): Promise<void> {
  try {
    await prisma.footerLink.delete({
      where: { id },
    });
    revalidatePath("/admin/footer");
    revalidatePath("/");
  } catch (error) {
    console.error("Error deleting footer link:", error);
    throw new Error("Failed to delete footer link");
  }
}

// Footer Social Link Actions
export async function getFooterSocialLinks(): Promise<FooterSocialLink[]> {
  try {
    const links = await prisma.footerSocialLink.findMany({
      orderBy: { order: "asc" },
    });
    return links;
  } catch (error) {
    console.error("Error fetching footer social links:", error);
    throw new Error("Failed to fetch footer social links");
  }
}

export async function createFooterSocialLink(data: {
  name: string;
  href: string;
  icon: string;
  order?: number;
}): Promise<FooterSocialLink> {
  try {
    const link = await prisma.footerSocialLink.create({
      data,
    });
    revalidatePath("/admin/footer");
    revalidatePath("/");
    return link;
  } catch (error) {
    console.error("Error creating footer social link:", error);
    throw new Error("Failed to create footer social link");
  }
}

export async function updateFooterSocialLink(
  id: string,
  data: { name?: string; href?: string; icon?: string; order?: number }
): Promise<FooterSocialLink> {
  try {
    const link = await prisma.footerSocialLink.update({
      where: { id },
      data,
    });
    revalidatePath("/admin/footer");
    revalidatePath("/");
    return link;
  } catch (error) {
    console.error("Error updating footer social link:", error);
    throw new Error("Failed to update footer social link");
  }
}

export async function deleteFooterSocialLink(id: string): Promise<void> {
  try {
    await prisma.footerSocialLink.delete({
      where: { id },
    });
    revalidatePath("/admin/footer");
    revalidatePath("/");
  } catch (error) {
    console.error("Error deleting footer social link:", error);
    throw new Error("Failed to delete footer social link");
  }
}

// Footer Info Actions
export async function getFooterInfo(): Promise<FooterInfo | null> {
  try {
    const info = await prisma.footerInfo.findFirst();
    return info;
  } catch (error) {
    console.error("Error fetching footer info:", error);
    throw new Error("Failed to fetch footer info");
  }
}

export async function updateFooterInfo(data: {
  companyName?: string;
  description?: string;
  copyrightText?: string;
}): Promise<FooterInfo> {
  try {
    const existingInfo = await prisma.footerInfo.findFirst();

    if (!existingInfo) {
      const info = await prisma.footerInfo.create({
        data: {
          companyName: data.companyName || "SoleMate",
          description: data.description || "",
          copyrightText:
            data.copyrightText || "© 2025 SoleMate. All Rights Reserved.",
        },
      });
      revalidatePath("/admin/footer");
      revalidatePath("/");
      return info;
    }

    const info = await prisma.footerInfo.update({
      where: { id: existingInfo.id },
      data,
    });
    revalidatePath("/admin/footer");
    revalidatePath("/");
    return info;
  } catch (error) {
    console.error("Error updating footer info:", error);
    throw new Error("Failed to update footer info");
  }
}
