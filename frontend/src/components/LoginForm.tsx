import { useForm } from "react-hook-form";
import type { LoginPayload, RegisterPayload } from "../types/auth";

type Mode = "login" | "register";

type Props = {
  mode: Mode;
  loading: boolean;
  error: string | null;
  onSubmit: (payload: LoginPayload | RegisterPayload) => Promise<void>;
};

type FormValues = {
  name: string;
  email: string;
  password: string;
};

export function LoginForm({ mode, loading, error, onSubmit }: Props) {
  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: ""
    }
  });

  const submit = handleSubmit(async (values) => {
    if (mode === "register") {
      await onSubmit(values);
      return;
    }

    await onSubmit({ email: values.email, password: values.password });
  });

  return (
    <form onSubmit={submit} className="space-y-4 rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/60">
      <div>
        <h1 className="text-3xl font-semibold text-ink">{mode === "login" ? "Sign in" : "Create account"}</h1>
        <p className="mt-2 text-sm text-slate-500">Use your EmailID & password to access the task board.</p>
      </div>
      {mode === "register" && (
        <input
          {...register("name")}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3"
          placeholder="Full name"
        />
      )}
      <input
        {...register("email")}
        type="email"
        className="w-full rounded-2xl border border-slate-200 px-4 py-3"
        placeholder="Email"
      />
      <input
        {...register("password")}
        type="password"
        className="w-full rounded-2xl border border-slate-200 px-4 py-3"
        placeholder="Password"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-2xl bg-accent px-4 py-3 font-medium text-white disabled:opacity-70"
      >
        {loading ? "Working..." : mode === "login" ? "Login" : "Register"}
      </button>
    </form>
  );
}
