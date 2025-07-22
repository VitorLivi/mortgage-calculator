import { IsNumber, IsEnum, Min, Max, Validate, IsIn } from "class-validator";
import {
  AMORTIZATION_PERIODS,
  PaymentSchedule,
} from "src/core/mortgage/domain/entities/mortgage-calculator.entity";
import { CalculateMortgageValidator } from "./calculate-mortgage.validator";

export class CalculateMortgageDto {
  @IsNumber({}, { message: "Property price must be a number" })
  @Min(1, { message: "Property price must be greater than $0" })
  propertyPrice: number;

  @IsNumber({}, { message: "Down payment must be a number" })
  @Min(1, { message: "Down payment must be greater than $0" })
  downPayment: number;

  @IsNumber({}, { message: "Interest rate must be a number" })
  @Min(0, { message: "Interest rate must be at least 0%" })
  @Max(30, { message: "Interest rate must be at most 30%" })
  annualInterestRate: number;

  @IsNumber({}, { message: "Amortization period must be a number" })
  @IsIn(AMORTIZATION_PERIODS, {
    message: "Please select a valid amortization period",
  })
  amortizationPeriod: number;

  @IsEnum(PaymentSchedule, {
    message: "Please select a valid payment schedule",
  })
  paymentSchedule: PaymentSchedule;

  @Validate(CalculateMortgageValidator)
  customValidation?: boolean;
}
