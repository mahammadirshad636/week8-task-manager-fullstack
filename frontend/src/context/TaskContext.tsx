import { createContext, useContext, type PropsWithChildren } from "react";
import { useTasks } from "../hooks/useTasks";

type TaskContextValue = ReturnType<typeof useTasks>;

const TaskContext = createContext<TaskContextValue | null>(null);

export function TaskProvider({ children }: PropsWithChildren) {
  const value = useTasks();
  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTaskContext must be used within TaskProvider");
  }
  return context;
}
