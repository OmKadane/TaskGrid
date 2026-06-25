import { useEffect, useMemo, useRef, useState } from "react";
import { useTaskGrid } from "../context/TaskGridContext";

// ── Helpers ─────────────────────────────────────────────────────────────────
function formatDate(iso) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function exportToMarkdown(tasks, completedIds) {
  const now = new Date().toLocaleString("en-US", {
    dateStyle: "long",
    timeStyle: "short",
  });

  const lines = [
    "# TaskGrid — Task Report",
    "",
    `> Generated on ${now}`,
    `> Total tasks: **${tasks.length}** | Completed: **${completedIds.size}** | Pending: **${tasks.length - completedIds.size}**`,
    "",
    "---",
    "",
  ];

  tasks.forEach((task) => {
    const done = completedIds.has(task.id);
    lines.push(`## ${done ? "~~" : ""}${task.title}${done ? "~~" : ""}`);
    lines.push("");
    lines.push(`**Status:** ${done ? "✅ Completed" : "🔵 Pending"}`);
    if (task.createdAt) {
      lines.push(`**Created:** ${formatDate(task.createdAt)}`);
    }
    lines.push(`**ID:** \`#${task.id}\``);
    lines.push("");
    lines.push(task.description);
    lines.push("");
    lines.push("---");
    lines.push("");
  });

  const blob = new Blob([lines.join("\n")], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `taskgrid-report-${Date.now()}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Skeleton ─────────────────────────────────────────────────────────────────
function TaskSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-surface-border bg-surface-raised p-5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="h-4 w-2/3 rounded bg-surface-border" />
        <div className="h-5 w-10 rounded-full bg-surface-border" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full rounded bg-surface-border" />
        <div className="h-3 w-4/5 rounded bg-surface-border" />
      </div>
      <div className="mt-4 h-3 w-24 rounded bg-surface-border" />
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2" aria-label="Loading tasks…" aria-busy="true">
      {[...Array(4)].map((_, i) => (
        <TaskSkeleton key={i} />
      ))}
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────
function EmptyState({ isFiltered }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="relative mb-6 flex items-center justify-center">
        <div className="absolute h-24 w-24 rounded-full bg-indigo-500/5 ring-1 ring-indigo-500/10" />
        <div className="absolute h-36 w-36 rounded-full bg-indigo-500/5 ring-1 ring-indigo-500/10" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-raised ring-1 ring-surface-border">
          <svg
            className="h-8 w-8 text-slate-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.2}
            stroke="currentColor"
            aria-hidden="true"
          >
            {isFiltered ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z"
              />
            )}
          </svg>
        </div>
      </div>
      <h3 className="mb-2 text-base font-semibold text-slate-300">
        {isFiltered ? "No matching tasks" : "No tasks yet"}
      </h3>
      <p className="max-w-xs text-sm text-slate-500">
        {isFiltered
          ? "Try adjusting your search query."
          : "Your task grid is empty. Use the form to add your first task."}
      </p>
      {!isFiltered && (
        <div className="mt-6 flex flex-col items-center gap-1 text-slate-600">
          <svg
            className="h-5 w-5 animate-bounce"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
          </svg>
          <span className="text-xs">Add your first task</span>
        </div>
      )}
    </div>
  );
}

// ── Error State ───────────────────────────────────────────────────────────────
function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 ring-1 ring-red-500/20">
        <svg
          className="h-7 w-7 text-red-400"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
          />
        </svg>
      </div>
      <h3 className="mb-1 text-sm font-semibold text-slate-300">Failed to load tasks</h3>
      <p className="mb-5 max-w-xs text-xs text-slate-500">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-2 rounded-lg border border-surface-border bg-surface px-4 py-2 text-xs font-medium text-slate-200 transition hover:border-indigo-500/40 hover:bg-surface-raised hover:text-white"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
        Retry
      </button>
    </div>
  );
}

// ── Task Card ─────────────────────────────────────────────────────────────────
function TaskCard({ task, completed, onToggleComplete, onDelete }) {
  return (
    <article
      className={`group relative flex flex-col rounded-xl border p-5 shadow-md transition-all duration-200 ${
        completed
          ? "border-emerald-500/20 bg-surface-raised opacity-60"
          : "border-surface-border bg-surface-raised hover:border-indigo-500/30 hover:shadow-indigo-500/5 hover:shadow-xl"
      }`}
      aria-label={`Task: ${task.title}${completed ? " (completed)" : ""}`}
    >
      {/* Action buttons — top-right, visible on hover */}
      <div className="absolute right-3 top-3 flex items-center gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
        {/* Complete toggle */}
        <button
          type="button"
          onClick={() => onToggleComplete(task.id)}
          aria-label={completed ? "Mark as pending" : "Mark as completed"}
          title={completed ? "Mark as pending" : "Mark as completed"}
          className={`flex h-6 w-6 items-center justify-center rounded-full border transition-all ${
            completed
              ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
              : "border-surface-border bg-surface text-slate-500 hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-400"
          }`}
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </button>

        {/* Delete */}
        <button
          type="button"
          onClick={() => onDelete(task.id)}
          aria-label="Delete task"
          title="Delete task"
          className="flex h-6 w-6 items-center justify-center rounded-full border border-surface-border bg-surface text-slate-500 transition-all hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
        </button>
      </div>

      {/* Top row: title + id badge */}
      <div className="mb-3 flex items-start gap-3 pr-16">
        <h3
          className={`line-clamp-2 text-sm font-semibold leading-snug transition-colors ${
            completed ? "text-slate-400 line-through decoration-slate-500" : "text-slate-100 group-hover:text-white"
          }`}
        >
          {task.title}
        </h3>
      </div>

      {/* ID badge row */}
      <div className="mb-2 flex items-center gap-2">
        <span className="rounded-full bg-surface px-2 py-0.5 font-mono text-xs text-slate-500 ring-1 ring-surface-border">
          #{task.id}
        </span>
        {completed && (
          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400 ring-1 ring-emerald-500/20">
            Completed
          </span>
        )}
      </div>

      {/* Description */}
      <p className={`line-clamp-3 flex-1 text-xs leading-relaxed ${completed ? "text-slate-500 line-through decoration-slate-600" : "text-slate-400"}`}>
        {task.description}
      </p>

      {/* Footer */}
      {task.createdAt && (
        <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-600">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <time dateTime={task.createdAt}>{formatDate(task.createdAt)}</time>
        </div>
      )}
    </article>
  );
}

// ── Search Bar ────────────────────────────────────────────────────────────────
function SearchBar({ value, onChange }) {
  return (
    <div className="relative flex-1">
      <svg
        className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
      <input
        id="task-search"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by title or description…"
        className="w-full rounded-lg border border-surface-border bg-surface py-2 pl-8 pr-3 text-xs text-slate-200 placeholder-slate-600 outline-none transition focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/15"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
        >
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

// ── Sort Toggle ───────────────────────────────────────────────────────────────
function SortToggle({ value, onChange }) {
  const isNewest = value === "newest";
  return (
    <button
      type="button"
      id="task-sort-toggle"
      onClick={() => onChange(isNewest ? "oldest" : "newest")}
      aria-label={`Sort: ${isNewest ? "Newest first" : "Oldest first"}`}
      title={`Sort: ${isNewest ? "Newest first" : "Oldest first"}`}
      className="flex items-center gap-1.5 rounded-lg border border-surface-border bg-surface px-3 py-2 text-xs font-medium text-slate-400 transition hover:border-indigo-500/30 hover:bg-surface-raised hover:text-slate-200"
    >
      <svg
        className={`h-3.5 w-3.5 transition-transform duration-300 ${isNewest ? "" : "rotate-180"}`}
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" />
      </svg>
      {isNewest ? "Newest" : "Oldest"}
    </button>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function TaskGrid() {
  const { tasks: taskState } = useTaskGrid();
  const { tasks, loading, error, fetchTasks, submitting, deleteTask } = taskState;

  // Tracks whether the initial fetch has completed — guards scrub effects
  const initialFetchDone = useRef(false);

  // Local UI state
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [completedIds, setCompletedIds] = useState(() => {
    try {
      const saved = localStorage.getItem("taskgrid-completed");
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });
  // deletedIds is intentionally NOT persisted — mock server resets IDs on restart,
  // which would cause recycled IDs to be silently filtered out.
  const [deletedIds, setDeletedIds] = useState(new Set());

  // Sync only completedIds to localStorage
  useEffect(() => {
    localStorage.setItem("taskgrid-completed", JSON.stringify([...completedIds]));
  }, [completedIds]);

  // Clear any stale deleted-ids that may linger from a previous session
  useEffect(() => {
    localStorage.removeItem("taskgrid-deleted");
  }, []);

  // Fetch on mount — then scrub stale completedIds against real server task IDs
  useEffect(() => {
    fetchTasks().then((fetchedTasks) => {
      if (!Array.isArray(fetchedTasks)) return; // fetch failed — don't scrub or mark done
      initialFetchDone.current = true; // only mark done on successful fetch
      const serverIds = new Set(fetchedTasks.map((t) => t.id));
      setCompletedIds((prev) => {
        const cleaned = new Set([...prev].filter((id) => serverIds.has(id)));
        return cleaned.size === prev.size ? prev : cleaned;
      });
    });
  }, [fetchTasks]);

  // Scrub on subsequent task list updates (e.g. after addTask re-fetches)
  // Gated by initialFetchDone so it never fires before the first fetch resolves
  useEffect(() => {
    if (!initialFetchDone.current || loading) return;
    const serverIds = new Set(tasks.map((t) => t.id));
    setCompletedIds((prev) => {
      const cleaned = new Set([...prev].filter((id) => serverIds.has(id)));
      return cleaned.size === prev.size ? prev : cleaned;
    });
  }, [tasks, loading]);

  // Handlers
  const handleToggleComplete = (id) => {
    setCompletedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleDelete = async (id) => {
    const wasCompleted = completedIds.has(id);

    // Optimistically hide the task immediately for instant UI feedback
    setDeletedIds((prev) => new Set([...prev, id]));
    setCompletedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });

    // Then delete from server (list re-fetches automatically inside deleteTask)
    const ok = await deleteTask(id);
    if (!ok) {
      // Rollback optimistic removal if server call failed
      setDeletedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      // Also restore completed state if it was set before deletion
      if (wasCompleted) {
        setCompletedIds((prev) => new Set([...prev, id]));
      }
    }
  };

  // Derived list: filter deleted → search → sort
  const visibleTasks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    let list = tasks.filter((t) => !deletedIds.has(t.id));

    if (q) {
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q),
      );
    }

    list = [...list].sort((a, b) => {
      const da = new Date(a.createdAt ?? 0).getTime();
      const db = new Date(b.createdAt ?? 0).getTime();
      return sortOrder === "newest" ? db - da : da - db;
    });

    return list;
  }, [tasks, deletedIds, searchQuery, sortOrder]);

  const activeTasks = tasks.filter((t) => !deletedIds.has(t.id));
  const completedCount = [...completedIds].filter((id) => !deletedIds.has(id)).length;

  const renderContent = () => {
    if (loading && tasks.length === 0) return <SkeletonGrid />;
    if (error && tasks.length === 0) return <ErrorState message={error} onRetry={fetchTasks} />;
    if (visibleTasks.length === 0) return <EmptyState isFiltered={searchQuery.trim().length > 0 || activeTasks.length > 0} />;

    return (
      <div className="grid gap-4 sm:grid-cols-2" role="list" aria-label="Task list">
        {visibleTasks.map((task) => (
          <div key={task.id} role="listitem">
            <TaskCard
              task={task}
              completed={completedIds.has(task.id)}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDelete}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <section
      className="rounded-2xl border border-surface-border bg-surface-raised p-6 shadow-xl"
      aria-labelledby="task-grid-heading"
    >
      {/* ── Header row ── */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 ring-1 ring-emerald-500/30">
            <svg
              className="h-4 w-4 text-emerald-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
              />
            </svg>
          </div>
          <div>
            <h2 id="task-grid-heading" className="text-base font-semibold text-white whitespace-nowrap">TaskGrid</h2>
            <p className="text-xs text-slate-500">
              {activeTasks.length > 0
                ? `${activeTasks.length} task${activeTasks.length !== 1 ? "s" : ""} · ${completedCount} completed`
                : "All your tasks will appear here"}
            </p>
          </div>
        </div>

        {/* Right-side actions */}
        <div className="flex items-center gap-2">
          {/* Export button */}
          {activeTasks.length > 0 && (
            <button
              type="button"
              id="task-export-btn"
              onClick={() => exportToMarkdown(activeTasks, completedIds)}
              title="Export tasks as Markdown"
              className="inline-flex items-center gap-1.5 rounded-lg border border-surface-border bg-surface px-3 py-2 text-xs font-medium text-slate-400 transition hover:border-indigo-500/30 hover:bg-surface-raised hover:text-indigo-300"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Export
            </button>
          )}

          {/* Refresh */}
          <button
            type="button"
            id="task-grid-refresh"
            onClick={fetchTasks}
            disabled={loading || submitting}
            aria-label="Refresh task list"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-surface-border bg-surface text-slate-400 transition hover:border-emerald-500/30 hover:bg-surface-raised hover:text-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <svg
              className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Search & Sort toolbar ── */}
      {(tasks.length > 0 || searchQuery) && (
        <div className="mb-4 flex items-center gap-2">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <SortToggle value={sortOrder} onChange={setSortOrder} />
        </div>
      )}

      {/* ── Content ── */}
      <div
        className="relative max-h-[560px] overflow-y-auto pr-0.5"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#2a3140 transparent" }}
      >
        {renderContent()}

        {/* Overlay spinner when re-fetching with existing cards */}
        {loading && tasks.length > 0 && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-2xl bg-surface-raised/40 backdrop-blur-sm">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-slate-700 border-t-emerald-400" />
          </div>
        )}
      </div>
    </section>
  );
}
