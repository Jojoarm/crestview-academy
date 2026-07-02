import { Skeleton } from '@/components/ui/skeleton';

export function DashboardSkeleton() {
  return (
    <div className="flex h-screen overflow-hidden bg-(--warm-white)">
      {/* Sidebar */}
      <aside className="hidden w-72 border-r border-(--border-sand) bg-white lg:flex lg:flex-col">
        <div className="p-6">
          <Skeleton className="h-8 w-36" />
        </div>

        <div className="flex flex-col gap-3 px-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-lg" />
          ))}
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-(--border-sand) bg-white px-6">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </header>

        {/* Content */}
        <main className="flex-1 space-y-6 p-6">
          <Skeleton className="h-10 w-72" />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
          </div>

          <Skeleton className="h-96 w-full rounded-xl" />
        </main>
      </div>
    </div>
  );
}
