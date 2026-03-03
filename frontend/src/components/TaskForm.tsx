import { useForm } from "react-hook-form";
import type { CreateTaskRequest, Task } from "../types/task";

type Props = {
  initialValue?: Partial<Task>;
  onSubmit: (payload: CreateTaskRequest) => Promise<unknown>;
};

export function TaskForm({ initialValue, onSubmit }: Props) {
  const { register, handleSubmit, reset } = useForm<CreateTaskRequest>({
    defaultValues: {
      title: initialValue?.title ?? "",
      description: initialValue?.description ?? "",
      priority: initialValue?.priority ?? "MEDIUM",
      status: initialValue?.status ?? "TODO",
      dueDate: initialValue?.dueDate ?? ""
    }
  });

  return (
    <form
      className="grid gap-3 rounded-3xl bg-white p-5 shadow-sm"
      onSubmit={handleSubmit(async (values) => {
        await onSubmit(values);
        if (!initialValue) {
          reset({
            title: "",
            description: "",
            priority: "MEDIUM",
            status: "TODO",
            dueDate: ""
          });
        }
      })}
    >
      <input
        {...register("title", { required: true })}
        placeholder="Task title"
        className="rounded-2xl border border-slate-200 px-4 py-3"
      />
      <textarea
        {...register("description")}
        placeholder="Description"
        className="min-h-24 rounded-2xl border border-slate-200 px-4 py-3"
      />
      <div className="grid gap-3 md:grid-cols-3">
        <select {...register("status")} className="rounded-2xl border border-slate-200 px-4 py-3">
          <option value="TODO">TODO</option>
          <option value="IN_PROGRESS">IN PROGRESS</option>
          <option value="REVIEW">REVIEW</option>
          <option value="DONE">DONE</option>
        </select>
        <select {...register("priority")} className="rounded-2xl border border-slate-200 px-4 py-3">
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
        </select>
        <input {...register("dueDate")} type="date" className="rounded-2xl border border-slate-200 px-4 py-3" />
      </div>
      <button type="submit" className="rounded-2xl bg-ink px-4 py-3 font-medium text-white">
        {initialValue ? "Update task" : "Create task"}
      </button>
    </form>
  );
}
