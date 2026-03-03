import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { DashboardPage } from "./Dashboard";

const mockNavigate = vi.fn();
const mockTaskContext = {
  tasks: [
    {
      id: 1,
      title: "Build dashboard",
      description: "Verify task board rendering",
      status: "TODO" as const,
      priority: "HIGH" as const,
      dueDate: "2026-03-10"
    },
    {
      id: 2,
      title: "Ship API integration",
      description: "Done task",
      status: "DONE" as const,
      priority: "MEDIUM" as const
    }
  ],
  loading: false,
  error: null,
  fetchTasks: vi.fn().mockResolvedValue(undefined),
  createTask: vi.fn().mockResolvedValue(undefined),
  updateTask: vi.fn().mockResolvedValue(undefined),
  updateTaskStatus: vi.fn().mockResolvedValue(undefined),
  deleteTask: vi.fn().mockResolvedValue(undefined)
};

vi.mock("../context/TaskContext", () => ({
  useTaskContext: () => mockTaskContext
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

describe("DashboardPage", () => {
  it("renders task-board stats and tasks", async () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    await waitFor(() => expect(mockTaskContext.fetchTasks).toHaveBeenCalled());

    expect(screen.getByText(/2 tasks, 0 overdue, 1 completed/i)).toBeInTheDocument();
    expect(screen.getByText("Build dashboard")).toBeInTheDocument();
    expect(screen.getByText("Ship API integration")).toBeInTheDocument();
    expect(screen.getAllByText("TODO").length).toBeGreaterThan(0);
    expect(screen.getAllByText("DONE").length).toBeGreaterThan(0);
  });
});
