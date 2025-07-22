import { UUID } from "node:crypto";
import { IEntity } from "src/core/@common/domain/entity.interface";

export enum PaymentSchedule {
  MONTHLY = "monthly",
  BI_WEEKLY = "bi-weekly",
  ACCELERATED_BI_WEEKLY = "accelerated-bi-weekly",
}

export const PAYMENT_FREQUENCIES = {
  [PaymentSchedule.MONTHLY]: 12,
  [PaymentSchedule.BI_WEEKLY]: 26,
  [PaymentSchedule.ACCELERATED_BI_WEEKLY]: 26,
} as const;

export const AMORTIZATION_PERIODS = [5, 10, 15, 20, 25, 30] as const;

export type AmortizationPeriod = (typeof AMORTIZATION_PERIODS)[number];

export interface CMHCRates {
  [key: string]: number;
}

export const CMHC_RATES: CMHCRates = {
  "5": 0.04,
  "10": 0.031,
  "15": 0.028,
};

export interface IMortgageCalculatorProps extends IEntity {
  propertyPrice: number;
  downPayment: number;
  annualInterestRate: number;
  amortizationPeriod: number;
  paymentSchedule: PaymentSchedule;
}

type CMHCInsurance = {
  isRequired: boolean;
  premium: number;
  rate: number;
  totalCost: number;
  monthlyPayment: number;
};

type PaymentBreakdown = {
  principal: number;
  interest: number;
  cmhcInsurance: number;
  totalPayment: number;
};

type AmortizationEntry = {
  paymentNumber: number;
  paymentDate: string;
  principalPayment: number;
  interestPayment: number;
  cmhcPayment: number;
  totalPayment: number;
  remainingBalance: number;
};

type CalculationResult = {
  paymentAmount: number;
  totalInterest: number;
  totalPayments: number;
  principalAmount: number;
  cmhcInsurance: CMHCInsurance;
  paymentBreakdown: PaymentBreakdown;
  amortizationSchedule: AmortizationEntry[];
};

export class MortgageCalculator implements IMortgageCalculatorProps {
  id: UUID;
  propertyPrice: number;
  downPayment: number;
  annualInterestRate: number;
  amortizationPeriod: number;
  paymentSchedule: PaymentSchedule;

  constructor(props: IMortgageCalculatorProps) {
    this.id = props.id;
    this.propertyPrice = props.propertyPrice;
    this.downPayment = props.downPayment;
    this.annualInterestRate = props.annualInterestRate;
    this.amortizationPeriod = props.amortizationPeriod;
    this.paymentSchedule = props.paymentSchedule;
  }

  public calculate(): CalculationResult {
    const paymentsPerYear = PAYMENT_FREQUENCIES[this.paymentSchedule];
    const totalPayments = this.amortizationPeriod * paymentsPerYear;
    const loanAmount = this.propertyPrice - this.downPayment;

    const cmhcInsurance = this.calculateCMHCInsurance(
      this.propertyPrice,
      this.downPayment,
      loanAmount,
      totalPayments,
    );

    const totalPrincipal = loanAmount + cmhcInsurance.totalCost;
    const ratePerPayment = this.annualInterestRate / 100 / paymentsPerYear;
    const paymentAmount = this.calculatePaymentAmount(
      totalPrincipal,
      ratePerPayment,
      totalPayments,
    );

    let remainingBalance = totalPrincipal;
    let totalInterest = 0;
    const amortizationSchedule: AmortizationEntry[] = [];

    for (let i = 1; i <= totalPayments; i++) {
      const interestPayment = remainingBalance * ratePerPayment;
      const principalPayment = paymentAmount - interestPayment;

      remainingBalance -= principalPayment;
      totalInterest += interestPayment;

      amortizationSchedule.push({
        paymentNumber: i,
        paymentDate: this.calculatePaymentDate(i),
        principalPayment,
        interestPayment,
        cmhcPayment: 0,
        totalPayment: paymentAmount,
        remainingBalance: Math.max(remainingBalance, 0),
      });
    }

    return {
      paymentAmount: Number(paymentAmount.toFixed(2)),
      totalPayments: Number((paymentAmount * totalPayments).toFixed(2)),
      totalInterest: Number(totalInterest.toFixed(2)),
      principalAmount: Number(totalPrincipal.toFixed(2)),
      cmhcInsurance,
      paymentBreakdown: {
        principal: Number(loanAmount.toFixed(2)),
        interest: Number(totalInterest.toFixed(2)),
        cmhcInsurance: Number(cmhcInsurance.totalCost.toFixed(2)),
        totalPayment: Number((paymentAmount * totalPayments).toFixed(2)),
      },
      amortizationSchedule: amortizationSchedule.map((entry) => ({
        ...entry,
        principalPayment: Number(entry.principalPayment.toFixed(2)),
        interestPayment: Number(entry.interestPayment.toFixed(2)),
        totalPayment: Number(entry.totalPayment.toFixed(2)),
        remainingBalance: Number(entry.remainingBalance.toFixed(2)),
      })),
    };
  }

  private calculatePaymentAmount(
    principal: number,
    rate: number,
    totalPayments: number,
  ): number {
    const numerator = principal * rate * Math.pow(1 + rate, totalPayments);
    const denominator = Math.pow(1 + rate, totalPayments) - 1;
    return numerator / denominator;
  }

  calculateCMHCInsurance(
    propertyPrice: number,
    downPayment: number,
    loanAmount: number,
    totalPayments: number,
  ): CMHCInsurance {
    const downPercentage = (downPayment / propertyPrice) * 100;

    let applicableRate = 0;
    if (downPercentage < 5) {
      throw new Error("Minimum down payment is 5% of the property price.");
    } else if (downPercentage < 10) {
      applicableRate = CMHC_RATES["5"];
    } else if (downPercentage < 15) {
      applicableRate = CMHC_RATES["10"];
    } else if (downPercentage < 20) {
      applicableRate = CMHC_RATES["15"];
    }

    const isRequired = downPercentage < 20;
    const premium = isRequired ? applicableRate : 0;
    const totalCost = isRequired ? loanAmount * premium : 0;
    const monthlyPayment = isRequired ? totalCost / totalPayments : 0;

    return {
      isRequired,
      premium,
      rate: premium,
      totalCost: Number(totalCost.toFixed(2)),
      monthlyPayment: Number(monthlyPayment.toFixed(2)),
    };
  }

  private calculatePaymentDate(paymentNumber: number): string {
    const date = new Date();

    switch (this.paymentSchedule) {
      case PaymentSchedule.MONTHLY:
        date.setMonth(date.getMonth() + (paymentNumber - 1));
        break;
      case PaymentSchedule.BI_WEEKLY:
      case PaymentSchedule.ACCELERATED_BI_WEEKLY:
        date.setDate(date.getDate() + (paymentNumber - 1) * 14);
        break;
    }

    return date.toISOString().split("T")[0];
  }
}
