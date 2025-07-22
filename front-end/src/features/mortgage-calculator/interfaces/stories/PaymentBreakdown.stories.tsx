import { PaymentBreakdownDetails } from "../PaymentBreakdown";
import type { Meta, StoryObj } from "@storybook/react";
import type { PaymentBreakdown } from "@/features/mortgage-calculator/types/mortgage";

const meta: Meta<typeof PaymentBreakdownDetails> = {
  title: "MortgageCalculator/PaymentBreakdownDetails",
  component: PaymentBreakdownDetails,
};

export default meta;

type Story = StoryObj<typeof PaymentBreakdownDetails>;

const baseBreakdown: PaymentBreakdown = {
  principal: 350000,
  interest: 145000,
  cmhcInsurance: 14300.25,
  totalPayment: 509300.25,
};

export const WithInsurance: Story = {
  args: {
    paymentBreakdown: baseBreakdown,
  },
};

export const WithoutInsurance: Story = {
  args: {
    paymentBreakdown: {
      ...baseBreakdown,
      cmhcInsurance: 0,
      totalPayment: 495000,
    },
  },
};
