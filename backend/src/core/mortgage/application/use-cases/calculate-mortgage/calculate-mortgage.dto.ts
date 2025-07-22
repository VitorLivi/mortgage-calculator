import { IsNumber, IsEnum, Min, Max, Validate, IsIn } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import {
  AMORTIZATION_PERIODS,
  PaymentSchedule,
} from "src/core/mortgage/domain/entities/mortgage-calculator.entity";
import { CalculateMortgageValidator } from "./calculate-mortgage.validator";

export class CalculateMortgageDto {
  @ApiProperty({
    description: "Total price of the property",
    example: 350000,
    minimum: 1,
  })
  @IsNumber({}, { message: "Property price must be a number" })
  @Min(1, { message: "Property price must be greater than $0" })
  propertyPrice: number;

  @ApiProperty({
    description: "Amount of the down payment",
    example: 50000,
    minimum: 1,
  })
  @IsNumber({}, { message: "Down payment must be a number" })
  @Min(1, { message: "Down payment must be greater than $0" })
  downPayment: number;

  @ApiProperty({
    description: "Annual interest rate as a percentage",
    example: 5.5,
    minimum: 0,
    maximum: 30,
  })
  @IsNumber({}, { message: "Interest rate must be a number" })
  @Min(0, { message: "Interest rate must be at least 0%" })
  @Max(30, { message: "Interest rate must be at most 30%" })
  annualInterestRate: number;

  @ApiProperty({
    description: "Amortization period in years",
    example: 25,
    enum: AMORTIZATION_PERIODS,
  })
  @IsNumber({}, { message: "Amortization period must be a number" })
  @IsIn(AMORTIZATION_PERIODS, {
    message: "Please select a valid amortization period",
  })
  amortizationPeriod: number;

  @ApiProperty({
    description: "Frequency of the mortgage payments",
    enum: PaymentSchedule,
    example: PaymentSchedule.MONTHLY,
  })
  @IsEnum(PaymentSchedule, {
    message: "Please select a valid payment schedule",
  })
  paymentSchedule: PaymentSchedule;

  @ApiProperty({
    description: "Custom validation flag (for internal logic)",
    required: false,
    example: false,
  })
  @Validate(CalculateMortgageValidator)
  customValidation?: boolean;
}
