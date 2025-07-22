import { Test, TestingModule } from '@nestjs/testing';
import { MortgageController } from '../mortgage.controller';
import { CalculateMortgage } from 'src/core/mortgage/application/use-cases/calculate-mortgage/calculate-mortgage.use-case';
import { PaymentSchedule } from 'src/core/mortgage/domain/entities/mortgage-calculator.entity';
import { CalculateMortgageDto } from 'src/core/mortgage/application/use-cases/calculate-mortgage/calculate-mortgage.dto';

describe('MortgageController', () => {
  let controller: MortgageController;
  let useCase: CalculateMortgage;

  const mockResult = {
    result: 'ok',
  };

  const mockUseCase = {
    execute: jest.fn().mockResolvedValue(mockResult),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MortgageController],
      providers: [
        {
          provide: CalculateMortgage,
          useValue: mockUseCase,
        },
      ],
    }).compile();

    controller = module.get<MortgageController>(MortgageController);
    useCase = module.get<CalculateMortgage>(CalculateMortgage);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call use case with DTO and return result', async () => {
    const dto: CalculateMortgageDto = {
      propertyPrice: 100000,
      downPayment: 5000,
      annualInterestRate: 3.89,
      amortizationPeriod: 25,
      paymentSchedule: PaymentSchedule.MONTHLY,
    };

    const result = await controller.calculateMortgage(dto);

    expect(useCase.execute).toHaveBeenCalledWith(dto);
    expect(result).toEqual(mockResult);
  });
});
