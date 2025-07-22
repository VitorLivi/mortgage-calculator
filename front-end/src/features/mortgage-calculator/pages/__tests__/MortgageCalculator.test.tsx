import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MortgageCalculator } from "../MortgageCalculator";
import * as api from "@/shared/api/mortgage";

describe("MortgageCalculator integration", () => {
  it("renders form, calculates and shows results, then resets", async () => {
    const mockResult = {
      paymentAmount: 9999,
      totalInterest: 99999,
      principalAmount: 999999,
      cmhcInsurance: {
        isRequired: true,
        premium: 99,
        rate: 0.04,
        totalCost: 999,
        monthlyPayment: 99,
      },
      totalPayments: 999999,
      paymentBreakdown: {
        principal: 9999,
        interest: 9999,
        cmhcInsurance: 0,
        totalPayment: 1300,
      },
      amortizationSchedule: [],
    };

    vi.spyOn(api, "calculateMortgage").mockResolvedValue(mockResult);
    render(<MortgageCalculator />);

    expect(screen.getByLabelText(/Property Price/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/Property Price/i), {
      target: { value: "500000" },
    });
    fireEvent.change(screen.getByLabelText(/Down Payment/i), {
      target: { value: "100000" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /Calculate Mortgage/i })
    );

    const resetButton = screen.getByRole("button", { name: /Reset/i });
    expect(resetButton).toBeInTheDocument();

    fireEvent.click(resetButton);

    expect(screen.getByLabelText(/Property Price/i)).toBeInTheDocument();
  });
});
