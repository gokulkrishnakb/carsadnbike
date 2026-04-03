import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton", className)} aria-hidden="true" />;
}

export function ListingCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <Skeleton className="h-52 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4 rounded-lg" />
        <Skeleton className="h-3.5 w-1/2 rounded-lg" />
        <div className="flex items-center gap-3 pt-1">
          <Skeleton className="h-3 w-12 rounded-lg" />
          <Skeleton className="h-3 w-16 rounded-lg" />
          <Skeleton className="h-3 w-14 rounded-lg ml-auto" />
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-slate-100">
          <Skeleton className="h-6 w-24 rounded-lg" />
          <Skeleton className="h-3 w-14 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function ChatSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className={`flex gap-3 ${i % 2 === 0 ? "" : "flex-row-reverse"}`}>
          <Skeleton className="h-9 w-9 rounded-full shrink-0" />
          <Skeleton className={`h-10 rounded-2xl ${i % 2 === 0 ? "w-48" : "w-36"}`} />
        </div>
      ))}
    </div>
  );
}
