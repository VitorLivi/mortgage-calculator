import { CalculateMortgage } from '../calculate-mortgage.use-case';
import { CalculateMortgageDto } from '../calculate-mortgage.dto';
import {
  MortgageCalculator,
  PaymentSchedule,
} from 'src/core/mortgage/domain/entities/mortgage-calculator.entity';

describe('CalculateMortgage Use Case', () => {
  let useCase: CalculateMortgage;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new CalculateMortgage();
  });

  it('should create MortgageCalculator and call calculate()', async () => {
    const input: CalculateMortgageDto = {
      propertyPrice: 100000,
      downPayment: 5000,
      annualInterestRate: 3.89,
      amortizationPeriod: 25,
      paymentSchedule: PaymentSchedule.MONTHLY,
    };

    const mockResult = { result: 'ok' };

    const calculateSpy = jest
      .spyOn(MortgageCalculator.prototype, 'calculate')
      .mockReturnValue(mockResult as any);

    const result = await useCase.execute(input);

    expect(calculateSpy).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockResult);
  });
});
