import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AmortizationEntry } from "@/features/mortgage-calculator/types/mortgage";
import { AmortizationScheduleDetails } from "../AmortizationSchedule";

const mockEntries: AmortizationEntry[] = [
  {
    paymentNumber: 1,
    paymentDate: new Date().toISOString(),
    principalPayment: 1000,
    interestPayment: 500,
    totalPayment: 1500,
    remainingBalance: 99000,
    cmhcPayment: 0,
  },
  {
    paymentNumber: 2,
    paymentDate: new Date().toISOString(),
    principalPayment: 1010,
    interestPayment: 490,
    totalPayment: 1500,
    remainingBalance: 97990,
    cmhcPayment: 0,
  },
];

describe("AmortizationScheduleDetails", () => {
  it("should render title and summary when visible", () => {
    render(
      <AmortizationScheduleDetails
        amortizationSchedule={mockEntries}
        showAmortizationSchedule={true}
        changeVisibility={() => {}}
      />
    );

    expect(screen.getByText("Amortization Schedule")).toBeInTheDocument();

    expect(screen.getByText("Payments")).toBeInTheDocument();
    expect(screen.getAllByText("Principal")).toHaveLength(2);
    expect(screen.getAllByText("Interest")).toHaveLength(2);
    expect(screen.getByText("Total")).toBeInTheDocument();

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getAllByText("2")).toHaveLength(2);
  });

  it("should not render schedule table if hidden", () => {
    render(
      <AmortizationScheduleDetails
        amortizationSchedule={mockEntries}
        showAmortizationSchedule={false}
        changeVisibility={() => {}}
      />
    );

    // Apenas o botão deve estar visível
    expect(screen.getByText("Show Schedule")).toBeInTheDocument();
    expect(screen.queryByText("Payments")).not.toBeInTheDocument();
  });

  it("should call changeVisibility when button is clicked", () => {
    const mockFn = vi.fn();

    render(
      <AmortizationScheduleDetails
        amortizationSchedule={mockEntries}
        showAmortizationSchedule={true}
        changeVisibility={mockFn}
      />
    );

    fireEvent.click(screen.getByRole("button"));
    expect(mockFn).toHaveBeenCalled();
  });

  it("should allow changing the selected year if multiple years", () => {
    const thisYear = new Date().getFullYear();

    const entries: AmortizationEntry[] = [
      {
        paymentNumber: 1,
        paymentDate: new Date(thisYear, 0, 1).toISOString(),
        principalPayment: 1000,
        interestPayment: 500,
        totalPayment: 1500,
        remainingBalance: 90000,
        cmhcPayment: 0,
      },
      {
        paymentNumber: 2,
        paymentDate: new Date(thisYear + 1, 0, 1).toISOString(),
        principalPayment: 1200,
        interestPayment: 300,
        totalPayment: 1500,
        remainingBalance: 88000,
        cmhcPayment: 0,
      },
    ];

    render(
      <AmortizationScheduleDetails
        amortizationSchedule={entries}
        showAmortizationSchedule={true}
        changeVisibility={() => {}}
      />
    );

    expect(screen.getByLabelText("View Year")).toBeInTheDocument();
    expect(screen.getByText("Year 1")).toBeInTheDocument();
    expect(screen.getByText("Year 2")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("View Year"), {
      target: { value: "2" },
    });

    expect(screen.getAllByText("2")).toHaveLength(1);
    expect(screen.getAllByText("$1,200.00")).toHaveLength(2);
  });
});
