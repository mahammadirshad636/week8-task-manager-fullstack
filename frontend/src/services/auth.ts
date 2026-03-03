import type { LoginPayload, RegisterPayload } from "../types/auth";
import { apiService } from "./api";

export const authService = {
  login: (payload: LoginPayload) => apiService.login(payload),
  register: (payload: RegisterPayload) => apiService.register(payload),
  logout: () => apiService.logout()
};
