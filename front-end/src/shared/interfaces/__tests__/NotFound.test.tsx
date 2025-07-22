import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import { NotFound } from "../NotFound";

describe("NotFound component", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders main headings and texts", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText(/Page Not Found/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Sorry, we couldn't find the page you're looking for/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /If you believe this is an error, please contact support/i
      )
    ).toBeInTheDocument();
  });

  it("renders 'Go to Mortgage Calculator' link with correct href", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    const link = screen.getByRole("link", {
      name: /Go to Mortgage Calculator/i,
    });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });

  it("calls window.history.back on 'Go Back' button click", () => {
    const backSpy = vi
      .spyOn(window.history, "back")
      .mockImplementation(() => {});

    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    const button = screen.getByRole("button", { name: /Go Back/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(backSpy).toHaveBeenCalledOnce();
  });
});
