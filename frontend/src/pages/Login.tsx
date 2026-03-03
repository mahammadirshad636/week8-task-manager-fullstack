import { useNavigate, useSearchParams } from "react-router-dom";
import { LoginForm } from "../components/LoginForm";
import { useAuth } from "../context/AuthContext";
import type { LoginPayload, RegisterPayload } from "../types/auth";

export function LoginPage() {
  const { login, register, loading, error } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") === "register" ? "register" : "login";

  const handleSubmit = async (payload: LoginPayload | RegisterPayload) => {
    if (mode === "register") {
      await register(payload as RegisterPayload);
    } else {
      await login(payload as LoginPayload);
    }
    navigate("/");
  };

  return (
    <div className="grid min-h-screen place-items-center bg-[linear-gradient(145deg,#ccfbf1_0%,#f8fafc_48%,#e2e8f0_100%)] px-6">
      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-2">
        <div className="rounded-[2rem] bg-ink p-8 text-white">
          <p className="text-sm uppercase tracking-[0.2em] text-teal-200">Week 8 Project</p>
          <h2 className="mt-4 text-4xl font-semibold">Task Manager.</h2>
          <p className="mt-4 text-slate-300">
            JWT authentication and task CRUD.
          </p>
        </div>
        <div>
          <LoginForm mode={mode} loading={loading} error={error} onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}
