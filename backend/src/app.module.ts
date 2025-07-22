import { Module } from "@nestjs/common";
import { MortgageModule } from "./webserver/mortgage/mortgage.module";

@Module({
  imports: [MortgageModule],
})
export class AppModule {}
