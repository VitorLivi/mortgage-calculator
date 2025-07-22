export interface MortgageInput {
  propertyPrice: number;
  downPayment: number;
  annualInterestRate: number;
  amortizationPeriod: number;
  paymentSchedule: PaymentSchedule;
}

export enum PaymentSchedule {
  MONTHLY = "monthly",
  BI_WEEKLY = "bi-weekly",
  ACCELERATED_BI_WEEKLY = "accelerated-bi-weekly",
}

export interface MortgageCalculationResult {
  paymentAmount: number;
  totalInterest: number;
  totalPayments: number;
  principalAmount: number;
  cmhcInsurance: CMHCInsurance;
  paymentBreakdown: PaymentBreakdown;
  amortizationSchedule: AmortizationEntry[];
}

export interface AmortizationEntry {
  paymentNumber: number;
  paymentDate: string;
  principalPayment: number;
  interestPayment: number;
  cmhcPayment: number;
  totalPayment: number;
  remainingBalance: number;
}
export interface CMHCInsurance {
  isRequired: boolean;
  premium: number;
  rate: number;
  totalCost: number;
  monthlyPayment: number;
}

export interface PaymentBreakdown {
  principal: number;
  interest: number;
  cmhcInsurance: number;
  totalPayment: number;
}

export interface MortgageValidationError {
  field: keyof MortgageInput;
  message: string;
  code: string;
}

export interface CMHCRates {
  [key: string]: number;
}

export const CMHC_RATES: CMHCRates = {
  "5": 0.004,
  "10": 0.031,
  "15": 0.028,
};

export const PAYMENT_FREQUENCIES = {
  [PaymentSchedule.MONTHLY]: 12,
  [PaymentSchedule.BI_WEEKLY]: 26,
  [PaymentSchedule.ACCELERATED_BI_WEEKLY]: 26,
} as const;

export const AMORTIZATION_PERIODS = [5, 10, 15, 20, 25, 30] as const;

export type AmortizationPeriod = (typeof AMORTIZATION_PERIODS)[number];

export interface MortgageFormData {
  propertyPrice: string;
  downPayment: string;
  annualInterestRate: string;
  amortizationPeriod: string;
  paymentSchedule: PaymentSchedule;
}

export interface CalculatorState {
  isLoading: boolean;
  result: MortgageCalculationResult | null;
  errors: MortgageValidationError[];
  lastCalculation: Date | null;
}
