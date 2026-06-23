import { createContext, useContext, useMemo } from "react";
import { useServerStatus } from "../hooks/useServerStatus";
import { useTasks } from "../hooks/useTasks";

const TaskGridContext = createContext(null);

export function TaskGridProvider({ children }) {
  const serverStatus = useServerStatus();
  const tasks = useTasks();

  const value = useMemo(
    () => ({
      serverStatus,
      tasks,
    }),
    [serverStatus, tasks],
  );

  return (
    <TaskGridContext.Provider value={value}>{children}</TaskGridContext.Provider>
  );
}

export function useTaskGrid() {
  const context = useContext(TaskGridContext);

  if (!context) {
    throw new Error("useTaskGrid must be used within a TaskGridProvider");
  }

  return context;
}
