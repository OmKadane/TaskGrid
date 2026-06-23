import { useRef, useState } from "react";
import { useTaskGrid } from "../context/TaskGridContext";

function CharCount({ value, max }) {
  const remaining = max - value.length;
  const isClose = remaining <= 20;
  const isOver = remaining < 0;
  return (
    <span
      className={`text-xs tabular-nums transition-colors ${
        isOver
          ? "text-red-400"
          : isClose
            ? "text-amber-400"
            : "text-slate-500"
      }`}
    >
      {remaining}
    </span>
  );
}

export default function TaskForm() {
  const { tasks: taskState } = useTaskGrid();
  const { submitting, addTask } = taskState;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const titleRef = useRef(null);

  const TITLE_MAX = 80;
  const DESC_MAX = 300;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMsg(null);

    const trimmedTitle = title.trim();
    const trimmedDesc = description.trim();

    // Client-side guard (mirrors the server's 400 logic)
    if (!trimmedTitle || !trimmedDesc) {
      setFormError("Both title and description are required.");
      titleRef.current?.focus();
      return;
    }

    const ok = await addTask({ title: trimmedTitle, description: trimmedDesc });

    if (ok) {
      setTitle("");
      setDescription("");
      setSuccessMsg("Task added successfully!");
      // Clear success message after 3 s
      setTimeout(() => setSuccessMsg(null), 3000);
    } else {
      // addTask already stores the server error in taskState.error –
      // we mirror it locally so the banner is scoped to this form.
      setFormError(taskState.error ?? "Failed to add task. Please try again.");
    }
  };

  return (
    <section
      className="rounded-2xl border border-surface-border bg-surface-raised p-6 shadow-xl"
      aria-labelledby="task-form-heading"
    >
      {/* ── Header ── */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-500/15 ring-1 ring-indigo-500/30">
          <svg
            className="h-4 w-4 text-indigo-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </div>
        <div>
          <h2
            id="task-form-heading"
            className="text-base font-semibold text-white"
          >
            New Task
          </h2>
          <p className="text-xs text-slate-500">
            Fill in the fields below and submit.
          </p>
        </div>
      </div>

      {/* ── Error Banner ── */}
      {formError && (
        <div
          role="alert"
          className="mb-4 flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
        >
          <svg
            className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
            />
          </svg>
          <span>{formError}</span>
          <button
            type="button"
            aria-label="Dismiss error"
            onClick={() => setFormError(null)}
            className="ml-auto text-red-400 transition hover:text-red-200"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      {/* ── Success Banner ── */}
      {successMsg && (
        <div
          role="status"
          aria-live="polite"
          className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300"
        >
          <svg
            className="h-4 w-4 flex-shrink-0 text-emerald-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m4.5 12.75 6 6 9-13.5"
            />
          </svg>
          {successMsg}
        </div>
      )}

      {/* ── Form ── */}
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Title */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label
              htmlFor="task-title"
              className="text-sm font-medium text-slate-300"
            >
              Title
              <span className="ml-1 text-red-400" aria-hidden="true">
                *
              </span>
            </label>
            <CharCount value={title} max={TITLE_MAX} />
          </div>
          <input
            id="task-title"
            ref={titleRef}
            type="text"
            value={title}
            maxLength={TITLE_MAX}
            onChange={(e) => {
              setTitle(e.target.value);
              if (formError) setFormError(null);
            }}
            placeholder="e.g. Implement auth middleware"
            disabled={submitting}
            autoComplete="off"
            className="w-full rounded-lg border border-surface-border bg-surface px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 outline-none ring-0 transition focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        {/* Description */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label
              htmlFor="task-description"
              className="text-sm font-medium text-slate-300"
            >
              Description
              <span className="ml-1 text-red-400" aria-hidden="true">
                *
              </span>
            </label>
            <CharCount value={description} max={DESC_MAX} />
          </div>
          <textarea
            id="task-description"
            value={description}
            maxLength={DESC_MAX}
            onChange={(e) => {
              setDescription(e.target.value);
              if (formError) setFormError(null);
            }}
            placeholder="Describe what needs to be done…"
            rows={3}
            disabled={submitting}
            className="w-full resize-none rounded-lg border border-surface-border bg-surface px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 outline-none ring-0 transition focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        {/* Submit */}
        <button
          id="task-form-submit"
          type="submit"
          disabled={submitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            <>
              <span
                aria-hidden="true"
                className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
              />
              Adding Task…
            </>
          ) : (
            <>
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Add Task
            </>
          )}
        </button>
      </form>
    </section>
  );
}
