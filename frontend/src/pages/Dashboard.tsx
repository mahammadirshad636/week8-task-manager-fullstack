import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { TaskForm } from "../components/TaskForm";
import { TaskList } from "../components/TaskList";
import { useTaskContext } from "../context/TaskContext";

export function DashboardPage() {
  const { tasks, loading, error, fetchTasks, createTask, updateTaskStatus } = useTaskContext();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    void fetchTasks();
  }, []);

  const filteredTasks = tasks.filter((task) =>
    `${task.title} ${task.description ?? ""}`.toLowerCase().includes(query.trim().toLowerCase())
  );

  const stats = {
    total: tasks.length,
    overdue: tasks.filter((task) => task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "DONE").length,
    completed: tasks.filter((task) => task.status === "DONE").length
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] bg-ink px-6 py-8 text-white shadow-xl shadow-slate-300/30">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.16em] text-teal-200">Dashboard</p>
            <h1 className="mt-2 text-4xl font-semibold">Manage work across the full stack.</h1>
            <p className="mt-3 text-slate-300">
              {stats.total} tasks, {stats.overdue} overdue, {stats.completed} completed
            </p>
          </div>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search tasks"
            className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-slate-300 lg:max-w-sm"
          />
        </div>
      </section>

      <TaskForm onSubmit={createTask} />

      {error && <p className="text-sm text-red-600">{error}</p>}
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <TaskList
          tasks={filteredTasks}
          onMove={updateTaskStatus}
          onSelect={(taskId) => navigate(`/tasks/${taskId}`)}
        />
      )}
    </div>
  );
}
