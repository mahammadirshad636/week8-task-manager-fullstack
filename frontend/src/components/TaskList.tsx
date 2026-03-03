import type { Task, TaskStatus } from "../types/task";

const columns: TaskStatus[] = ["TODO", "IN_PROGRESS", "REVIEW", "DONE"];

type Props = {
  tasks: Task[];
  onMove: (taskId: number, status: TaskStatus) => Promise<unknown>;
  onSelect: (taskId: number) => void;
};

export function TaskList({ tasks, onMove, onSelect }: Props) {
  return (
    <div className="grid gap-4 xl:grid-cols-4">
      {columns.map((column) => {
        const columnTasks = tasks.filter((task) => task.status === column);
        return (
          <section
            key={column}
            onDragOver={(event) => event.preventDefault()}
            onDrop={async (event) => {
              const taskId = Number(event.dataTransfer.getData("text/plain"));
              if (!Number.isNaN(taskId)) {
                await onMove(taskId, column);
              }
            }}
            className="rounded-3xl bg-white/90 p-4 shadow-sm ring-1 ring-slate-100"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-wide text-slate-700">{column.replace("_", " ")}</h2>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-500">{columnTasks.length}</span>
            </div>
            <div className="space-y-3">
              {columnTasks.map((task) => (
                <article
                  key={task.id}
                  draggable
                  onDragStart={(event) => event.dataTransfer.setData("text/plain", String(task.id))}
                  onClick={() => onSelect(task.id)}
                  className="cursor-pointer rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:bg-white"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-medium text-ink">{task.title}</h3>
                    <span className="text-xs font-medium text-warning">{task.priority}</span>
                  </div>
                  <p className="mt-2 line-clamp-3 text-sm text-slate-500">{task.description || "No description"}</p>
                  {task.dueDate && <p className="mt-3 text-xs text-slate-400">Due {task.dueDate}</p>}
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
