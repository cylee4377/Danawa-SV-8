import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function RadarCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4 pb-3">
        <div className="flex items-center gap-3 flex-1">
          <Skeleton className="h-6 w-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-7 w-20" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-7 w-16" />
            <Skeleton className="h-3 w-14" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-7 w-12" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <Skeleton className="h-9 w-full" />
      </CardContent>
    </Card>
  );
}

export function RadarListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <RadarCardSkeleton key={i} />
      ))}
    </div>
  );
}
