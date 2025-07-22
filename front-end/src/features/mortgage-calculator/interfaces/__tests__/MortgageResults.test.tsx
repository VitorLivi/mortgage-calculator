import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MortgageResults } from "../MortgageResults";
import { MortgageCalculationResult } from "@/features/mortgage-calculator/types/mortgage";

vi.mock("@/shared/utils/currency", () => ({
  formatCurrency: (value: number) => `$${value.toFixed(2)}`,
  formatPercentage: (value: number) => `${(value * 100).toFixed(2)}%`,
}));

vi.mock("../interfaces/InsuranceDetails", () => ({
  InsuranceDetails: ({ cmhcInsurance }: any) => (
    <div data-testid="insurance-details">{JSON.stringify(cmhcInsurance)}</div>
  ),
}));

vi.mock("../interfaces/PaymentBreakdown", () => ({
  PaymentBreakdownDetails: ({ paymentBreakdown }: any) => (
    <div data-testid="payment-breakdown">
      {JSON.stringify(paymentBreakdown)}
    </div>
  ),
}));

vi.mock("../interfaces/AmortizationSchedule", () => ({
  AmortizationScheduleDetails: ({
    showAmortizationSchedule,
    changeVisibility,
    amortizationSchedule,
  }: any) => (
    <div>
      <button onClick={changeVisibility}>Toggle Schedule</button>
      {showAmortizationSchedule && (
        <div data-testid="amortization-schedule">
          {JSON.stringify(amortizationSchedule)}
        </div>
      )}
    </div>
  ),
}));

describe("MortgageResults", () => {
  const mockResult: MortgageCalculationResult = {
    paymentAmount: 1500,
    totalInterest: 10000,
    principalAmount: 50000,
    cmhcInsurance: {
      isRequired: true,
      rate: 0.02,
      premium: 1000,
      totalCost: 1100,
    },
    paymentBreakdown: {
      principal: 50000,
      interest: 10000,
      cmhcInsurance: 1000,
      totalPayment: 61000,
    },
    amortizationSchedule: [
      {
        paymentNumber: 1,
        paymentDate: new Date().toISOString(),
        principalPayment: 1000,
        interestPayment: 200,
        totalPayment: 1200,
        remainingBalance: 49000,
      },
    ],
  } as any;

  const lastCalculated = new Date("2025-07-22T10:00:00");

  it("renders formatted values and child components", () => {
    render(
      <MortgageResults
        result={mockResult}
        lastCalculated={lastCalculated}
        onRecalculate={() => {}}
      />
    );

    expect(screen.getAllByText("$1500.00")).toHaveLength(1);
    expect(screen.getAllByText("$10000.00")).toHaveLength(2);
    expect(screen.getAllByText("$50000.00")).toHaveLength(2);
    expect(screen.getAllByText("$60000.00")).toHaveLength(1);

    expect(screen.getByText(/2025.*10:00/i)).toBeInTheDocument();
  });

  it("calls onRecalculate when button clicked", () => {
    const onRecalculate = vi.fn();

    render(
      <MortgageResults
        result={mockResult}
        lastCalculated={null}
        onRecalculate={onRecalculate}
      />
    );

    fireEvent.click(
      screen.getByRole("button", { name: /Calculate Different Scenario/i })
    );

    expect(onRecalculate).toHaveBeenCalledOnce();
  });
});
