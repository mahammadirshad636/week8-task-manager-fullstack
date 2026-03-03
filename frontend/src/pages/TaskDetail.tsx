import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { TaskForm } from "../components/TaskForm";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { useTaskContext } from "../context/TaskContext";
import { apiService } from "../services/api";
import type { Task } from "../types/task";

export function TaskDetailPage() {
  const { id } = useParams();
  const { updateTask, deleteTask } = useTaskContext();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTask() {
      if (!id) {
        return;
      }
      const data = await apiService.getTask(Number(id));
      setTask(data);
      setLoading(false);
    }

    void loadTask();
  }, [id]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!task) {
    return <p>Task not found.</p>;
  }

  return (
    <div className="space-y-6">
      <Link to="/" className="text-sm font-medium text-accent">
        Back to dashboard
      </Link>
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-ink">{task.title}</h1>
        <p className="mt-2 text-sm text-slate-500">{task.description || "No description"}</p>
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
          <span>Status: {task.status}</span>
          <span>Priority: {task.priority}</span>
          <span>Due: {task.dueDate || "None"}</span>
        </div>
      </div>
      <TaskForm
        initialValue={task}
        onSubmit={async (payload) => {
          const updated = await updateTask(task.id, payload);
          setTask(updated);
        }}
      />
      <button
        onClick={async () => {
          await deleteTask(task.id);
          window.location.href = "/";
        }}
        className="rounded-2xl bg-red-600 px-4 py-3 text-white"
      >
        Delete task
      </button>
    </div>
  );
}
