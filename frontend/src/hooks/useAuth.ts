import { useState } from "react";
import { apiService } from "../services/api";
import { authService } from "../services/auth";
import type { LoginPayload, RegisterPayload } from "../types/auth";
import type { UserSummary } from "../types/task";

function getStoredUser(): UserSummary | null {
  const raw = localStorage.getItem("currentUser");
  return raw ? (JSON.parse(raw) as UserSummary) : null;
}

export function useAuthState() {
  const [user, setUser] = useState<UserSummary | null>(getStoredUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = Boolean(user && localStorage.getItem("accessToken"));

  const login = async (payload: LoginPayload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(payload);
      apiService.storeTokens(response);
      setUser(response.user);
    } catch (err) {
      setError("Invalid email or password");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.register(payload);
      apiService.storeTokens(response);
      setUser(response.user);
    } catch (err) {
      setError("Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout
  };
}
