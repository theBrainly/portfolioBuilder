export default function AdminLoading() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-surface rounded-lg" />
          <div className="h-4 w-72 bg-surface rounded-md" />
        </div>
        <div className="h-10 w-32 bg-surface rounded-xl" />
      </div>

      {/* Stats row skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-28 bg-surface rounded-2xl border border-border"
          />
        ))}
      </div>

      {/* Content skeleton */}
      <div className="bg-surface rounded-2xl border border-border p-6 space-y-4">
        <div className="h-5 w-36 bg-border rounded-md" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="h-10 w-10 bg-border rounded-xl shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 bg-border rounded-md" />
              <div className="h-3 w-1/2 bg-border rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
