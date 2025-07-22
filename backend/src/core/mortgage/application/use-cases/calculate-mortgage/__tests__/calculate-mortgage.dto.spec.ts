import { validate } from 'class-validator';
import { CalculateMortgageDto } from '../calculate-mortgage.dto';
import { PaymentSchedule } from 'src/core/mortgage/domain/entities/mortgage-calculator.entity';

describe('CalculateMortgageDto', () => {
  const validDto = (): CalculateMortgageDto => {
    const dto = new CalculateMortgageDto();
    dto.propertyPrice = 100000;
    dto.downPayment = 5000;
    dto.annualInterestRate = 3.89;
    dto.amortizationPeriod = 25;
    dto.paymentSchedule = PaymentSchedule.MONTHLY;
    return dto;
  };

  it('should validate successfully with valid data', async () => {
    const dto = validDto();
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail if property price is 0', async () => {
    const dto = validDto();
    dto.propertyPrice = 0;
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.min).toBe(
      'Property price must be greater than $0',
    );
  });

  it('should fail if down payment is missing', async () => {
    const dto = validDto();
    dto.downPayment = 0;
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'downPayment')).toBe(true);
  });

  it('should fail if interest rate is above 30', async () => {
    const dto = validDto();
    dto.annualInterestRate = 35;
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'annualInterestRate')).toBe(true);
  });

  it('should fail if amortization period is invalid', async () => {
    const dto = validDto();
    dto.amortizationPeriod = 99;
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'amortizationPeriod')).toBe(true);
  });

  it('should fail if payment schedule is invalid', async () => {
    const dto = validDto();
    dto.paymentSchedule = 'INVALID' as any;
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'paymentSchedule')).toBe(true);
  });
});
