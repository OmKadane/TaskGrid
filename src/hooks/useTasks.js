import { useCallback, useState } from "react";
import { addTask as addTaskRequest, listTasks } from "../services/api";

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await listTasks();
      setTasks(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.message ||
        "Failed to load tasks.";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const addTask = useCallback(
    async ({ title, description }) => {
      setSubmitting(true);
      setError(null);

      try {
        await addTaskRequest({ title, description });
        await fetchTasks();
        return true;
      } catch (err) {
        const message =
          err.response?.data?.error ||
          err.message ||
          "Failed to add task.";
        setError(message);
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [fetchTasks],
  );

  return {
    tasks,
    loading,
    submitting,
    error,
    fetchTasks,
    addTask,
  };
}
