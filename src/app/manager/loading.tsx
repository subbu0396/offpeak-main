export default function ManagerLoading() {
  return (
    <div className="p-6 space-y-8 max-w-5xl animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center gap-3">
        <div className="h-6 w-6 rounded bg-slate-200" />
        <div className="space-y-1">
          <div className="h-5 w-40 rounded bg-slate-200" />
          <div className="h-4 w-28 rounded bg-slate-200" />
        </div>
      </div>

      {/* KPI cards skeleton */}
      <div>
        <div className="h-4 w-20 rounded bg-slate-200 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl ring-1 ring-foreground/10 bg-card p-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-slate-200" />
                <div className="space-y-1">
                  <div className="h-3 w-24 rounded bg-slate-200" />
                  <div className="h-6 w-10 rounded bg-slate-200" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick action cards skeleton */}
      <div>
        <div className="h-4 w-28 rounded bg-slate-200 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl ring-1 ring-foreground/10 bg-card p-4 space-y-3">
              <div className="h-9 w-9 rounded-lg bg-slate-200" />
              <div className="h-4 w-32 rounded bg-slate-200" />
              <div className="h-3 w-full rounded bg-slate-200" />
              <div className="h-3 w-3/4 rounded bg-slate-200" />
              <div className="h-8 w-full rounded-lg bg-slate-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
