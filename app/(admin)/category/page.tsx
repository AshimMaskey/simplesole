import { CategoriesTable } from "@/components/table/categories-table";

export default async function CategoriesPage() {
  return (
    <div className="space-y-6 p-4">
      <div>
        <h1 className="text-3xl mb-3 font-semibold">Categories Management</h1>
        <p className="text-muted-foreground">
          Manage and view all product categories
        </p>
      </div>

      <CategoriesTable />
    </div>
  );
}
