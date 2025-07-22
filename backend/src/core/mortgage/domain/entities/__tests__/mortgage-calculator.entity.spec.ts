import { randomUUID } from 'node:crypto';
import {
  MortgageCalculator,
  PaymentSchedule,
} from '../mortgage-calculator.entity';

describe('MortgageCalculator Entity', () => {
  const baseProps = {
    id: randomUUID(),
    propertyPrice: 500_000,
    downPayment: 50_000,
    annualInterestRate: 5.0,
    amortizationPeriod: 25,
    paymentSchedule: PaymentSchedule.MONTHLY,
  };

  it('should instantiate properly with valid props', () => {
    const calc = new MortgageCalculator(baseProps);
    expect(calc.propertyPrice).toBe(500_000);
    expect(calc.downPayment).toBe(50_000);
    expect(calc.paymentSchedule).toBe(PaymentSchedule.MONTHLY);
  });

  it('should calculate mortgage correctly', () => {
    const calc = new MortgageCalculator(baseProps);
    const result = calc.calculate();

    expect(result.paymentAmount).toBeGreaterThan(0);
    expect(result.totalPayments).toBeGreaterThan(0);
    expect(result.totalInterest).toBeGreaterThan(0);
    expect(result.amortizationSchedule.length).toBe(
      baseProps.amortizationPeriod * 12,
    );
    expect(result.cmhcInsurance.isRequired).toBe(true);
  });

  it('should throw error for down payment < 5%', () => {
    const props = { ...baseProps, downPayment: 10_000 };
    const calc = new MortgageCalculator(props);
    expect(() => calc.calculate()).toThrowError(
      'Minimum down payment is 5% of the property price.',
    );
  });

  it('should not require CMHC if down payment >= 20%', () => {
    const props = { ...baseProps, downPayment: 100_000 };
    const calc = new MortgageCalculator(props);
    const result = calc.calculate();
    expect(result.cmhcInsurance.isRequired).toBe(false);
    expect(result.cmhcInsurance.totalCost).toBe(0);
  });

  it('should compute future payment dates properly for monthly schedule', () => {
    const calc = new MortgageCalculator(baseProps);
    const result = calc.calculate();
    const dates = result.amortizationSchedule.map((e) => e.paymentDate);
    expect(dates[0]).toMatch(/\d{4}-\d{2}-\d{2}/);
  });
});
