import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CalculateMortgageDto } from 'src/core/mortgage/application/use-cases/calculate-mortgage/calculate-mortgage.dto';
import { CalculateMortgage } from 'src/core/mortgage/application/use-cases/calculate-mortgage/calculate-mortgage.use-case';

@Controller('mortgage')
export class MortgageController {
  constructor(private readonly calculateMortgageUseCase: CalculateMortgage) {}

  @Post('calculate')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  async calculateMortgage(
    @Body() calculateMortgageDto: CalculateMortgageDto,
  ): Promise<ReturnType<CalculateMortgage['execute']>> {
    return this.calculateMortgageUseCase.execute(calculateMortgageDto);
  }
}
