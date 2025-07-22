import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PaymentBreakdown } from "@/features/mortgage-calculator/types/mortgage";
import { PaymentBreakdownDetails } from "../PaymentBreakdown";

vi.mock("@/shared/utils/currency", () => ({
  formatCurrency: (val: number) => `$${val.toFixed(2)}`,
}));

describe("PaymentBreakdownDetails", () => {
  const baseData: PaymentBreakdown = {
    principal: 50000,
    interest: 20000,
    cmhcInsurance: 8000,
    totalPayment: 78000,
  };

  it("should render all fields when CMHC Insurance is present", () => {
    render(<PaymentBreakdownDetails paymentBreakdown={baseData} />);

    expect(screen.getByText("Payment Breakdown")).toBeInTheDocument();
    expect(screen.getByText("Principal")).toBeInTheDocument();
    expect(screen.getByText("$50000.00")).toBeInTheDocument();

    expect(screen.getByText("Interest")).toBeInTheDocument();
    expect(screen.getByText("$20000.00")).toBeInTheDocument();

    expect(screen.getByText("CMHC Insurance")).toBeInTheDocument();
    expect(screen.getByText("$8000.00")).toBeInTheDocument();

    expect(screen.getByText("Total Payment")).toBeInTheDocument();
    expect(screen.getByText("$78000.00")).toBeInTheDocument();
  });

  it("should not render CMHC Insurance when the value is 0", () => {
    const dataWithoutInsurance = {
      ...baseData,
      cmhcInsurance: 0,
    };

    render(<PaymentBreakdownDetails paymentBreakdown={dataWithoutInsurance} />);

    expect(screen.queryByText("CMHC Insurance")).not.toBeInTheDocument();
    expect(screen.queryByText("$0.00")).not.toBeInTheDocument();

    expect(screen.getByText("$50000.00")).toBeInTheDocument();
    expect(screen.getByText("$78000.00")).toBeInTheDocument();
  });
});
