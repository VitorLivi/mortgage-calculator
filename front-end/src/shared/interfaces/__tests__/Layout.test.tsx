import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { Layout } from "../Layout";

describe("Layout component", () => {
  it("renders header with correct link and text", () => {
    render(
      <MemoryRouter>
        <Layout>
          <div>Test Children</div>
        </Layout>
      </MemoryRouter>
    );

    const link = screen.getByRole("link", { name: /mortgage calculator/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });

  it("renders children inside main content area", () => {
    render(
      <MemoryRouter>
        <Layout>
          <div data-testid="children">Child Content</div>
        </Layout>
      </MemoryRouter>
    );

    expect(screen.getByTestId("children")).toHaveTextContent("Child Content");
  });

  it("renders footer with current year and expected text", () => {
    render(
      <MemoryRouter>
        <Layout>
          <div>Footer Test</div>
        </Layout>
      </MemoryRouter>
    );

    const currentYear = new Date().getFullYear().toString();

    expect(
      screen.getByText(
        new RegExp(`© ${currentYear} WorldSource Technical Assessment`, "i")
      )
    ).toBeInTheDocument();

    expect(screen.getByText(/cmhc insurance info/i)).toBeInTheDocument();
    expect(screen.getByText(/built with react & vite/i)).toBeInTheDocument();
  });

  it("renders hamburger menu button for mobile", () => {
    render(
      <MemoryRouter>
        <Layout>
          <div>Menu Test</div>
        </Layout>
      </MemoryRouter>
    );

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });
});
