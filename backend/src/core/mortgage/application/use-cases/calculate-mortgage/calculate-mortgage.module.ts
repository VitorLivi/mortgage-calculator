import { Module } from "@nestjs/common";
import { CalculateMortgage } from "./calculate-mortgage.use-case";

@Module({
  providers: [CalculateMortgage],
  exports: [CalculateMortgage],
})
export class CalculateMortgageModule {}
