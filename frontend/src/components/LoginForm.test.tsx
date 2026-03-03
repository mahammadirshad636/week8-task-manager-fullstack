import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { LoginForm } from "./LoginForm";

describe("LoginForm", () => {
  it("submits login credentials", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(<LoginForm mode="login" loading={false} error={null} onSubmit={onSubmit} />);

    await user.type(screen.getByPlaceholderText("Email"), "user@example.com");
    await user.type(screen.getByPlaceholderText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Login" }));

    expect(onSubmit).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "password123"
    });
  });

  it("shows the register name field in register mode", () => {
    render(<LoginForm mode="register" loading={false} error={null} onSubmit={vi.fn().mockResolvedValue(undefined)} />);

    expect(screen.getByPlaceholderText("Full name")).toBeInTheDocument();
  });
});
