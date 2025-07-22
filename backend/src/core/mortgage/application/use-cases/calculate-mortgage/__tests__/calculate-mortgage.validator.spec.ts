import { Validate } from 'class-validator';
import { validate } from 'class-validator';
import { CalculateMortgageValidator } from '../calculate-mortgage.validator';

class TestDto {
  propertyPrice: number;
  downPayment: number;
  amortizationPeriod: number;

  @Validate(CalculateMortgageValidator)
  customValidation: boolean;
}

describe('CalculateMortgageValidator', () => {
  it('should pass for valid down payment and amortization period', async () => {
    const dto = new TestDto();
    dto.propertyPrice = 500_000;
    dto.downPayment = 50_000;
    dto.amortizationPeriod = 25;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail if down payment is less than 5% for property <= $500k', async () => {
    const dto = new TestDto();
    dto.propertyPrice = 400_000;
    dto.downPayment = 10_000;
    dto.amortizationPeriod = 25;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.CustomMortgageValidator).toContain(
      'Invalid mortgage values',
    );
  });

  it('should fail if down payment is below blended 5%-10% rule between $500k and $1.5M', async () => {
    const dto = new TestDto();
    dto.propertyPrice = 1_000_000;
    dto.downPayment = 60_000;
    dto.amortizationPeriod = 25;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.CustomMortgageValidator).toContain(
      'Invalid mortgage values',
    );
  });

  it('should fail if property > $1.5M and down payment < 20%', async () => {
    const dto = new TestDto();
    dto.propertyPrice = 1_600_000;
    dto.downPayment = 200_000;
    dto.amortizationPeriod = 25;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.CustomMortgageValidator).toContain(
      'Invalid mortgage values',
    );
  });

  it('should fail if down payment < 20% and amortization > 25 years', async () => {
    const dto = new TestDto();
    dto.propertyPrice = 900_000;
    dto.downPayment = 50_000;
    dto.amortizationPeriod = 30;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.CustomMortgageValidator).toContain(
      'Invalid mortgage values',
    );
  });

  it('should pass if down payment >= 20% and amortization > 25 years', async () => {
    const dto = new TestDto();
    dto.propertyPrice = 900_000;
    dto.downPayment = 200_000;
    dto.amortizationPeriod = 30;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
