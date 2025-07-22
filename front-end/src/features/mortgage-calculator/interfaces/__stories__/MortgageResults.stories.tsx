import { MortgageResults } from "../MortgageResults";
import type { Meta, StoryObj } from "@storybook/react";
import type { MortgageCalculationResult } from "@/features/mortgage-calculator/types/mortgage";

const meta: Meta<typeof MortgageResults> = {
  title: "MortgageCalculator/MortgageResults",
  component: MortgageResults,
};

export default meta;

type Story = StoryObj<typeof MortgageResults>;

const mockResult: MortgageCalculationResult = {
  paymentAmount: 9999,
  totalInterest: 9999,
  principalAmount: 99999,
  cmhcInsurance: {
    isRequired: true,
    premium: 9999.99,
    rate: 0.04,
    totalCost: 99999.99,
    monthlyPayment: 99,
  },
  paymentBreakdown: {
    principal: 1200,
    interest: 600,
    totalPayment: 1800,
    cmhcInsurance: 1200,
  },
  totalPayments: 9999,
  amortizationSchedule: [
    {
      cmhcPayment: 9999,
      principalPayment: 999,
      interestPayment: 9999,
      totalPayment: 9999,
      paymentDate: "2025-09-24",
      paymentNumber: 9,
      remainingBalance: 999999.22,
    },
    {
      cmhcPayment: 9999,
      principalPayment: 999,
      interestPayment: 9999,
      totalPayment: 9999,
      paymentDate: "2025-10-24",
      paymentNumber: 9,
      remainingBalance: 999999.22,
    },
    {
      cmhcPayment: 9999,
      principalPayment: 999,
      interestPayment: 9999,
      totalPayment: 9999,
      paymentDate: "2025-10-24",
      paymentNumber: 9,
      remainingBalance: 999999.22,
    },
  ],
};

export const Default: Story = {
  args: {
    result: mockResult,
    lastCalculated: new Date("2025-07-22T15:00:00"),
    onRecalculate: () => alert("Recalculating..."),
  },
};
