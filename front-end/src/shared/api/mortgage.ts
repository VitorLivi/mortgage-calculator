import {
  MortgageCalculationResult,
  MortgageInput,
} from "@/features/mortgage-calculator/types/mortgage";
import api from "./axios";

export async function calculateMortgage(
  data: MortgageInput
): Promise<MortgageCalculationResult> {
  const response = await api.post("/mortgage/calculate", data);
  return response.data;
}
