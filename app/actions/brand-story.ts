"use server";

import { prisma } from "@/lib/prisma";

export type BrandStoryFeature = {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

export async function getBrandStoryFeatures(): Promise<BrandStoryFeature[]> {
  try {
    const features = await prisma.brandStoryFeature.findMany({
      orderBy: { order: "asc" },
    });
    return features;
  } catch (error) {
    console.error("Error fetching brand story features:", error);
    throw new Error("Failed to fetch brand story features");
  }
}

export async function createBrandStoryFeature(data: {
  title: string;
  description: string;
  icon: string;
  order?: number;
}): Promise<BrandStoryFeature> {
  try {
    const feature = await prisma.brandStoryFeature.create({
      data: {
        title: data.title,
        description: data.description,
        icon: data.icon,
        order: data.order || 0,
      },
    });

    return feature;
  } catch (error) {
    console.error("Error creating brand story feature:", error);
    throw new Error("Failed to create brand story feature");
  }
}

export async function updateBrandStoryFeature(
  id: string,
  data: {
    title?: string;
    description?: string;
    icon?: string;
    order?: number;
  }
): Promise<BrandStoryFeature> {
  try {
    const feature = await prisma.brandStoryFeature.update({
      where: { id },
      data,
    });

    return feature;
  } catch (error) {
    console.error("Error updating brand story feature:", error);
    throw new Error("Failed to update brand story feature");
  }
}

export async function deleteBrandStoryFeature(id: string): Promise<void> {
  try {
    await prisma.brandStoryFeature.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error deleting brand story feature:", error);
    throw new Error("Failed to delete brand story feature");
  }
}

export async function reorderBrandStoryFeatures(
  features: { id: string; order: number }[]
): Promise<void> {
  try {
    await Promise.all(
      features.map((feature) =>
        prisma.brandStoryFeature.update({
          where: { id: feature.id },
          data: { order: feature.order },
        })
      )
    );
  } catch (error) {
    console.error("Error reordering brand story features:", error);
    throw new Error("Failed to reorder brand story features");
  }
}
