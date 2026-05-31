import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="space-y-6 p-6">
      <Skeleton className="h-10 w-96 max-w-full" />

      <div className="rounded-md border">
        <div className="grid grid-cols-1 gap-3 border-b p-3 sm:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full sm:col-span-2 lg:col-span-4" />
        </div>

        <div className="p-3">
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        <div className="border-t p-3">
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-12" />
            <Skeleton className="h-10 w-12" />
            <Skeleton className="h-10 w-12" />
            <Skeleton className="h-10 w-20" />
          </div>
        </div>
      </div>
    </main>
  );
}
