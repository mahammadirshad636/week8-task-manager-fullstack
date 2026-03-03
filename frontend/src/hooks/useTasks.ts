import { useEffect, useState } from "react";
import { apiService } from "../services/api";
import { taskWebSocketService } from "../services/websocket";
import type { CreateTaskRequest, Task, UpdateTaskRequest } from "../types/task";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function upsertTask(current: Task[], nextTask: Task) {
    const existingIndex = current.findIndex((task) => task.id === nextTask.id);

    if (existingIndex === -1) {
      return [nextTask, ...current];
    }

    return current.map((task) => (task.id === nextTask.id ? nextTask : task));
  }

  async function fetchTasks() {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getTasks();
      setTasks(response.content.reduce<Task[]>((current, task) => upsertTask(current, task), []));
    } catch (err) {
      setError("Failed to load tasks");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function createTask(payload: CreateTaskRequest) {
    setLoading(true);
    setError(null);
    try {
      const created = await apiService.createTask(payload);
      setTasks((current) => upsertTask(current, created));
      return created;
    } catch (err) {
      setError("Failed to create task");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function updateTask(id: number, payload: UpdateTaskRequest) {
    setLoading(true);
    setError(null);
    try {
      const updated = await apiService.updateTask(id, payload);
      setTasks((current) => upsertTask(current, updated));
      return updated;
    } catch (err) {
      setError("Failed to update task");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function updateTaskStatus(id: number, status: Task["status"]) {
    const updated = await apiService.updateTaskStatus(id, status);
    setTasks((current) => upsertTask(current, updated));
    return updated;
  }

  async function deleteTask(id: number) {
    await apiService.deleteTask(id);
    setTasks((current) => current.filter((task) => task.id !== id));
  }

  useEffect(() => {
    taskWebSocketService.connect((event) => {
      if (typeof event.payload === "number" && event.type === "TASK_DELETED") {
        setTasks((current) => current.filter((task) => task.id !== event.payload));
        return;
      }

      const task = event.payload as Task;
      setTasks((current) => upsertTask(current, task));
    });

    return () => taskWebSocketService.disconnect();
  }, []);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask
  };
}
