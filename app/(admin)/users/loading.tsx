export default function Loading() {
  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col gap-4">
        <div className="h-10 w-[300px] bg-muted animate-pulse rounded" />
        <div className="h-10 w-[150px] bg-muted animate-pulse rounded" />
      </div>
      <div className="h-[500px] w-full bg-muted animate-pulse rounded" />
    </div>
  );
}
