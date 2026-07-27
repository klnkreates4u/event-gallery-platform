import { cn } from '@/utils/cn';

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-warm-ivory dark:bg-neutral-800',
        className
      )}
    />
  );
}

export function GalleryCardSkeleton() {
  return (
    <div className="rounded-card overflow-hidden border border-border dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
}

export function GalleryGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <GalleryCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function MasonryGridSkeleton() {
  const heights = ['aspect-square', 'aspect-[3/4]', 'aspect-[4/3]', 'aspect-[2/3]', 'aspect-square', 'aspect-[4/3]', 'aspect-[3/4]', 'aspect-square'];
  return (
    <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-0">
      {heights.map((h, i) => (
        <div key={i} className={`${h} w-full mb-4 rounded-gallery overflow-hidden`}>
          <Skeleton className="w-full h-full" />
        </div>
      ))}
    </div>
  );
}

export function DashboardMetricsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="rounded-card border border-border dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 space-y-3">
          <div className="flex justify-between items-center">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-8 w-8 rounded-button" />
          </div>
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-3 w-28" />
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-card border border-border dark:border-neutral-800 overflow-hidden">
      <div className="p-4 border-b border-border dark:border-neutral-800 bg-soft-cream/50 dark:bg-neutral-900">
        <Skeleton className="h-4 w-40" />
      </div>
      <div className="divide-y divide-warm-ivory dark:divide-neutral-800">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-6 py-4">
            <Skeleton className="h-10 w-10 rounded-button flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-8 w-20 rounded-button" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SearchResultsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 rounded-card border border-border dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <Skeleton className="w-16 h-16 rounded-button flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function MediaCardSkeleton() {
  return (
    <div className="aspect-square rounded-gallery overflow-hidden bg-neutral-100 dark:bg-neutral-800">
      <Skeleton className="w-full h-full" />
    </div>
  );
}
