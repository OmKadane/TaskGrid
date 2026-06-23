import { useEffect } from "react";
import { useTaskGrid } from "../context/TaskGridContext";

function StatusSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="mx-auto h-16 w-16 rounded-full bg-surface-border" />
      <div className="mx-auto h-5 w-32 rounded bg-surface-border" />
      <div className="mx-auto h-4 w-48 rounded bg-surface-border" />
    </div>
  );
}

export default function ServerStatusDashboard() {
  const { serverStatus } = useTaskGrid();
  const { loading, isOnline, status, error, checkStatus } = serverStatus;

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  return (
    <section
      className="rounded-2xl border border-surface-border bg-surface-raised p-8 shadow-xl"
      aria-labelledby="server-status-heading"
    >
      <div className="mb-8 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2
            id="server-status-heading"
            className="text-xl font-semibold text-white"
          >
            Server Health
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Live connection status for the TaskGrid mock API.
          </p>
        </div>
        <button
          type="button"
          onClick={checkStatus}
          disabled={loading}
          className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg border border-surface-border bg-surface px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-emerald-500/40 hover:bg-surface-raised hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:mt-0"
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-600 border-t-emerald-400" />
              Checking…
            </>
          ) : (
            <>
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
              Check Status
            </>
          )}
        </button>
      </div>

      <div className="flex flex-col items-center py-6 text-center">
        {loading && !status && !error ? (
          <StatusSkeleton />
        ) : (
          <>
            <div
              className={`relative flex h-20 w-20 items-center justify-center rounded-full ring-1 ${
                isOnline
                  ? "bg-emerald-500/10 ring-emerald-500/30"
                  : "bg-red-500/10 ring-red-500/30"
              }`}
            >
              {isOnline ? (
                <>
                  <span className="absolute inline-flex h-12 w-12 animate-ping rounded-full bg-emerald-400/20" />
                  <span className="relative flex h-4 w-4 items-center justify-center">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative h-4 w-4 rounded-full bg-emerald-500" />
                  </span>
                </>
              ) : (
                <span className="h-4 w-4 rounded-full bg-red-500" />
              )}
            </div>

            <p
              className={`mt-5 text-2xl font-semibold ${
                isOnline ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {isOnline ? "Online" : "Offline"}
            </p>

            <p className="mt-2 max-w-sm text-sm text-slate-400">
              {isOnline
                ? "The mock server at localhost:8000 is reachable and responding."
                : error ||
                  "Unable to connect to the server. Make sure the mock server is running."}
            </p>

            {status && (
              <p className="mt-4 rounded-lg bg-surface px-4 py-2 font-mono text-xs text-slate-500">
                status: &quot;{status}&quot;
              </p>
            )}
          </>
        )}
      </div>

      {error && !loading && (
        <div
          role="alert"
          className="mt-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
        >
          {error}
        </div>
      )}
    </section>
  );
}
