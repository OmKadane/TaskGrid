import { useTaskGrid } from "../context/TaskGridContext";

export default function ConnectionBadge() {
  const { serverStatus } = useTaskGrid();
  const { loading, isOnline, status, error } = serverStatus;

  if (loading) {
    return (
      <div
        className="flex items-center gap-2 rounded-full border border-surface-border bg-surface-raised px-3 py-1.5 text-xs font-medium text-slate-400"
        aria-live="polite"
      >
        <span className="h-2 w-2 animate-pulse rounded-full bg-slate-500" />
        Checking…
      </div>
    );
  }

  if (isOnline) {
    return (
      <div
        className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400"
        aria-live="polite"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
        </span>
        Online
      </div>
    );
  }

  return (
    <div
      className="flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400"
      aria-live="polite"
      title={error ?? "Server unreachable"}
    >
      <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
      {status ? status : "Offline"}
    </div>
  );
}
