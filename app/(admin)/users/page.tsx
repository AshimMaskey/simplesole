import { UsersTable } from "@/components/table/users-table";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllUsers } from "./actions/userActions";

export default async function UsersPage() {
  const users = await getAllUsers();
  console.log(users);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-3 font-semibold ">User Management</h1>
        <p className="text-muted-foreground">
          Manage and view all users in your ecommerce shoe store
        </p>
      </div>

      {users.length === 0 ? <TableSkeleton /> : <UsersTable users={users} />}
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Skeleton className="h-10 w-[300px]" />
        <Skeleton className="h-10 w-[150px]" />
      </div>
      <Skeleton className="h-[500px] w-full" />
    </div>
  );
}
