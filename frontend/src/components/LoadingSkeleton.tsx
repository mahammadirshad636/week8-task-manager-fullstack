export function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="animate-pulse rounded-2xl bg-white p-4 shadow-sm">
          <div className="mb-3 h-4 w-1/3 rounded bg-slate-200" />
          <div className="h-3 w-full rounded bg-slate-100" />
        </div>
      ))}
    </div>
  );
}
