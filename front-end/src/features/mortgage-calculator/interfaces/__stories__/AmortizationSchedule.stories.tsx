import { AmortizationScheduleDetails } from "../AmortizationSchedule";
import type { Meta, StoryObj } from "@storybook/react";
import type { AmortizationEntry } from "@/features/mortgage-calculator/types/mortgage";
import { useState } from "react";

const meta: Meta<typeof AmortizationScheduleDetails> = {
  title: "MortgageCalculator/AmortizationScheduleDetails",
  component: AmortizationScheduleDetails,
};

export default meta;

type Story = StoryObj<typeof AmortizationScheduleDetails>;

const baseDate = new Date();
const makeEntry = (
  paymentNumber: number,
  offsetMonths: number,
  principal: number,
  interest: number,
  balance: number
): AmortizationEntry => {
  const paymentDate = new Date(baseDate);
  paymentDate.setMonth(paymentDate.getMonth() + offsetMonths);
  return {
    cmhcPayment: 0,
    paymentNumber,
    paymentDate: paymentDate.toISOString(),
    principalPayment: principal,
    interestPayment: interest,
    totalPayment: principal + interest,
    remainingBalance: balance,
  };
};

const amortizationSchedule: AmortizationEntry[] = [
  makeEntry(1, 0, 1000, 500, 350000),
  makeEntry(2, 1, 1020, 480, 348980),
  makeEntry(3, 2, 1050, 450, 347930),
  makeEntry(13, 12, 1100, 400, 335000),
  makeEntry(14, 13, 1125, 375, 333875),
];

const Wrapper = () => {
  const [show, setShow] = useState(true);

  return (
    <AmortizationScheduleDetails
      amortizationSchedule={amortizationSchedule}
      showAmortizationSchedule={show}
      changeVisibility={() => setShow(!show)}
    />
  );
};

export const Default: Story = {
  render: () => <Wrapper />,
};
