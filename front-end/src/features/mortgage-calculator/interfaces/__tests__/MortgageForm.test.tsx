import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MortgageForm } from "../MortgageForm";
import { PaymentSchedule } from "@/features/mortgage-calculator/types/mortgage";

describe("MortgageForm", () => {
  const onCalculate = vi.fn();
  const onReset = vi.fn();

  const renderComponent = (props = {}) =>
    render(
      <MortgageForm
        onCalculate={onCalculate}
        onReset={onReset}
        errors={[]}
        isLoading={false}
        {...props}
      />
    );

  it("renders inputs and buttons", () => {
    renderComponent();

    expect(screen.getByLabelText(/Property Price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Down Payment/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Annual Interest Rate/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Amortization Period/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Payment Schedule/i)).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /Calculate Mortgage/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Reset/i })).toBeInTheDocument();
  });

  it("accepts valid input and calls onCalculate", async () => {
    renderComponent();

    fireEvent.change(screen.getByLabelText(/Property Price/i), {
      target: { value: "500000" },
    });
    fireEvent.change(screen.getByLabelText(/Down Payment/i), {
      target: { value: "100000" },
    });
    fireEvent.change(screen.getByLabelText(/Annual Interest Rate/i), {
      target: { value: "3.5" },
    });
    fireEvent.change(screen.getByLabelText(/Amortization Period/i), {
      target: { value: "25" },
    });
    fireEvent.change(screen.getByLabelText(/Payment Schedule/i), {
      target: { value: PaymentSchedule.MONTHLY },
    });

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /Calculate Mortgage/i })
      ).not.toBeDisabled()
    );

    fireEvent.click(
      screen.getByRole("button", { name: /Calculate Mortgage/i })
    );

    await waitFor(() => {
      expect(onCalculate).toHaveBeenCalled();
    });
  });

  it("calls onReset when reset button clicked", () => {
    renderComponent();

    fireEvent.click(screen.getByRole("button", { name: /Reset/i }));

    expect(onReset).toHaveBeenCalled();
  });

  it("disables buttons when loading", () => {
    renderComponent({ isLoading: true });

    expect(screen.getByRole("button", { name: /Calculating/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /Reset/i })).toBeDisabled();
  });
});
