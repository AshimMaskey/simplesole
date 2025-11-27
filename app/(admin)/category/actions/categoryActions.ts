import prisma from "@/lib/prisma";

export async function createCategory(name: string) {
  try {
    await prisma.category.create({
      data: { name },
    });
    return { success: true };
  } catch (error: unknown) {
    console.error(error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function updateCategory(id: string, name: string) {
  try {
    await prisma.category.update({
      where: { id },
      data: { name },
    });
    return { success: true };
  } catch (error: unknown) {
    console.error(error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({
      where: { id },
    });
    return { success: true };
  } catch (error: unknown) {
    console.error(error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: "asc" },
    });
    return categories;
  } catch (error: unknown) {
    console.error(error);
    return [];
  }
}

export async function getCategoryById(id: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { id },
    });
    if (!category) throw new Error("Category not found");
    return category;
  } catch (error: unknown) {
    console.error(error);
    return null;
  }
}
