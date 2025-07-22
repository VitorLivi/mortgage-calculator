import { Module } from "@nestjs/common";
import { MortgageController } from "./mortgage.controller";
import { CalculateMortgageModule } from "src/core/mortgage/application/use-cases/calculate-mortgage/calculate-mortgage.module";

@Module({
  imports: [CalculateMortgageModule],
  controllers: [MortgageController],
})
export class MortgageModule {}
