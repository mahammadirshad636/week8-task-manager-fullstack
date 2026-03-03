import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function AppShell() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.14),_transparent_38%),linear-gradient(180deg,#f8fafc_0%,#edf2f7_100%)]">
      <header className="border-b border-white/60 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-xl font-semibold text-ink">
            Task Manager
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">{user?.name}</span>
            <button onClick={() => void logout()} className="rounded-2xl bg-ink px-4 py-2 text-sm text-white">
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
