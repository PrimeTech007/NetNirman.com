export function SkeletonRow({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="border-2 border-black shadow-brutal bg-white overflow-hidden" style={{ borderRadius: "2px" }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 p-3 border-b border-black/10 animate-pulse">
          {Array.from({ length: cols }).map((_, j) => (
            <div
              key={j}
              className="h-4 bg-black/10"
              style={{ width: `${Math.random() * 30 + 15}%`, borderRadius: "2px" }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonCard({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="border-2 border-black shadow-brutal bg-white p-4 space-y-3 animate-pulse"
          style={{ borderRadius: "2px" }}
        >
          <div className="h-4 bg-black/10 w-3/4" style={{ borderRadius: "2px" }} />
          <div className="h-6 bg-black/10 w-1/2" style={{ borderRadius: "2px" }} />
          <div className="h-3 bg-black/10 w-full" style={{ borderRadius: "2px" }} />
          <div className="h-3 bg-black/10 w-2/3" style={{ borderRadius: "2px" }} />
        </div>
      ))}
    </div>
  );
}

export function SkeletonPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 bg-black/10 w-48 animate-pulse" style={{ borderRadius: "2px" }} />
        <div className="h-10 bg-black/10 w-32 animate-pulse" style={{ borderRadius: "2px" }} />
      </div>
      <SkeletonRow />
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-6">
      <div className="h-8 bg-black/10 w-48 animate-pulse" style={{ borderRadius: "2px" }} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="border-2 border-black shadow-brutal bg-white p-4 animate-pulse"
            style={{ borderRadius: "2px" }}
          >
            <div className="h-3 bg-black/10 w-1/2 mb-2" style={{ borderRadius: "2px" }} />
            <div className="h-8 bg-black/10 w-1/3" style={{ borderRadius: "2px" }} />
          </div>
        ))}
      </div>
      <SkeletonCard count={2} />
    </div>
  );
}
