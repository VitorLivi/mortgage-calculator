import { InsuranceDetails } from "../InsuranceDetails";
import type { Meta, StoryObj } from "@storybook/react";
import type { CMHCInsurance } from "@/features/mortgage-calculator/types/mortgage";

const meta: Meta<typeof InsuranceDetails> = {
  title: "MortgageCalculator/InsuranceDetails",
  component: InsuranceDetails,
};

export default meta;

type Story = StoryObj<typeof InsuranceDetails>;

const mockInsurance: CMHCInsurance = {
  isRequired: true,
  premium: 14300.25,
  rate: 0.04,
  totalCost: 15000.67,
  monthlyPayment: 1250.0,
};

export const WithInsurance: Story = {
  render: () => <InsuranceDetails cmhcInsurance={mockInsurance} />,
};

export const NoInsurance: Story = {
  render: () => (
    <InsuranceDetails
      cmhcInsurance={{
        isRequired: false,
        premium: 0,
        rate: 0,
        totalCost: 0,
        monthlyPayment: 0,
      }}
    />
  ),
};
