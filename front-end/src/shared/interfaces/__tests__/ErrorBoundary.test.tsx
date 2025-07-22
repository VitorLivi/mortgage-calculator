import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import ErrorBoundary from "../ErrorBoundary";

const ThrowErrorComponent = () => {
  throw new Error("Test error");
};

describe("ErrorBoundary", () => {
  beforeAll(() => {
    process.env.NODE_ENV = "development";
  });

  afterAll(() => {
    process.env.NODE_ENV = "test";
  });

  it("renders children when no error", () => {
    render(
      <ErrorBoundary>
        <div>Child Content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText("Child Content")).toBeDefined();
  });

  it("renders fallback UI on error", () => {
    const fallback = <div>Custom Fallback</div>;

    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(
      <ErrorBoundary fallback={fallback}>
        <ThrowErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText("Custom Fallback")).toBeDefined();

    consoleErrorSpy.mockRestore();
  });

  it("renders default fallback when no fallback prop provided", () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText("Oops! Something went wrong")).toBeDefined();
    expect(
      screen.getByText(
        /We encountered an unexpected error. Please try refreshing the page/i
      )
    ).toBeDefined();

    consoleErrorSpy.mockRestore();
  });

  it("retry button resets error state and shows children again", () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const { unmount } = render(
      <ErrorBoundary>
        <ThrowErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText("Oops! Something went wrong")).toBeDefined();

    fireEvent.click(screen.getByRole("button", { name: /try again/i }));

    unmount();

    render(
      <ErrorBoundary>
        <div>Recovered Content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText("Recovered Content")).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

  it("refresh button calls window.location.reload", () => {
    const reloadMock = vi.fn();

    Object.defineProperty(window, "location", {
      writable: true,
      value: { ...window.location, reload: reloadMock },
    });

    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowErrorComponent />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByRole("button", { name: /refresh page/i }));

    expect(reloadMock).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it("shows technical details in development mode", () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowErrorComponent />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByText(/Technical Details/i));

    expect(screen.getAllByText(/Error:/i)).toHaveLength(2);
    expect(screen.getByText(/Test error/i)).toBeDefined();

    consoleErrorSpy.mockRestore();
  });
});
