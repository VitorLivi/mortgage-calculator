import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";
import { CalculateMortgageDto } from "./calculate-mortgage.dto";

@ValidatorConstraint({ name: "CustomMortgageValidator", async: false })
export class CalculateMortgageValidator
  implements ValidatorConstraintInterface
{
  validate(_: any, args: ValidationArguments): boolean {
    const o = args.object as CalculateMortgageDto;
    const dpPct = o.downPayment / o.propertyPrice;

    const errors: Array<{ field: string; message: string }> = [];

    if (o.propertyPrice <= 500_000 && dpPct < 0.05) {
      errors.push({
        field: "downPayment",
        message: "Minimum 5% down payment required",
      });
    } else if (o.propertyPrice <= 1_500_000) {
      const excess = o.propertyPrice - 500_000;
      const needed = 0.05 + (excess / o.propertyPrice) * 0.05;

      if (dpPct < needed) {
        errors.push({
          field: "downPayment",
          message: `Minimum down payment is 5% up to $500k and 10% on the excess — you need at least ${(needed * 100).toFixed(2)}%`,
        });
      }
    } else if (o.propertyPrice > 1_500_000 && dpPct < 0.2) {
      errors.push({
        field: "downPayment",
        message: "For homes over $1.5M, minimum 20% down is required",
      });
    }

    if (
      dpPct < 0.2 &&
      o.propertyPrice < 1_500_000 &&
      o.amortizationPeriod > 25
    ) {
      errors.push({
        field: "amortizationPeriod",
        message:
          "For insured mortgages (down <20%), max amortization is 25 years unless first-time/new home",
      });
    }

    return errors.length === 0;
  }

  defaultMessage(args: ValidationArguments) {
    return "Invalid mortgage values";
  }
}
