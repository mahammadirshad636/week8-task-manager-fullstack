import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig
} from "axios";
import type { AuthResponse, LoginPayload, RegisterPayload } from "../types/auth";
import type { CreateTaskRequest, PagedResponse, Task, UpdateTaskRequest } from "../types/task";

type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

class ApiService {
  private readonly axiosInstance: AxiosInstance;
  private readonly baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api";
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: { "Content-Type": "application/json" }
    });

    this.axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as RetryableConfig | undefined;
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
          originalRequest._retry = true;
          const refreshToken = localStorage.getItem("refreshToken");

          if (!refreshToken) {
            this.clearTokens();
            return Promise.reject(error);
          }

          try {
            const { data } = await axios.post<AuthResponse>(`${this.baseURL}/auth/refresh`, { refreshToken });
            this.storeTokens(data);
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
            return this.axiosInstance(originalRequest);
          } catch (refreshError) {
            this.clearTokens();
            window.location.href = "/login";
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  storeTokens(response: AuthResponse) {
    localStorage.setItem("accessToken", response.accessToken);
    localStorage.setItem("refreshToken", response.refreshToken);
    localStorage.setItem("currentUser", JSON.stringify(response.user));
  }

  clearTokens() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("currentUser");
  }

  async login(payload: LoginPayload) {
    const { data } = await this.axiosInstance.post<AuthResponse>("/auth/login", payload);
    return data;
  }

  async register(payload: RegisterPayload) {
    const { data } = await this.axiosInstance.post<AuthResponse>("/auth/register", payload);
    return data;
  }

  async logout() {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      await this.axiosInstance.post("/auth/logout", { refreshToken });
    }
    this.clearTokens();
  }

  async getTasks(params?: { status?: string; priority?: string; assigneeId?: number }) {
    const { data } = await this.axiosInstance.get<PagedResponse<Task>>("/tasks", { params });
    return data;
  }

  async getTask(id: number) {
    const { data } = await this.axiosInstance.get<Task>(`/tasks/${id}`);
    return data;
  }

  async createTask(payload: CreateTaskRequest) {
    const { data } = await this.axiosInstance.post<Task>("/tasks", payload);
    return data;
  }

  async updateTask(id: number, payload: UpdateTaskRequest) {
    const { data } = await this.axiosInstance.put<Task>(`/tasks/${id}`, payload);
    return data;
  }

  async updateTaskStatus(id: number, status: string) {
    const { data } = await this.axiosInstance.put<Task>(`/tasks/${id}/status`, { status });
    return data;
  }

  async deleteTask(id: number) {
    await this.axiosInstance.delete(`/tasks/${id}`);
  }
}

export const apiService = new ApiService();
