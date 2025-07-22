import { CalculateMortgageDto } from './calculate-mortgage.dto';
import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { MortgageCalculator } from 'src/core/mortgage/domain/entities/mortgage-calculator.entity';
import { IUseCase } from 'src/core/@common/application/use-cases/use-case.interface';

@Injectable()
export class CalculateMortgage implements IUseCase<CalculateMortgageDto, any> {
  constructor() {}

  async execute(
    input: CalculateMortgageDto,
  ): Promise<ReturnType<MortgageCalculator['calculate']>> {
    const calculator = new MortgageCalculator({ id: randomUUID(), ...input });
    return calculator.calculate();
  }
}
