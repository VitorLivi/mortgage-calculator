import { describe, it, expect } from "vitest";
import { formatCurrency, formatPercentage } from "../currency";

describe("formatCurrency", () => {
  it("should format number as USD currency with 2 decimals", () => {
    expect(formatCurrency(1234.5)).toBe("$1,234.50");
    expect(formatCurrency(0)).toBe("$0.00");
    expect(formatCurrency(1000000.123)).toBe("$1,000,000.12");
    expect(formatCurrency(-45.678)).toBe("-$45.68");
  });
});

describe("formatPercentage", () => {
  it("should format number as percentage with 2 decimals", () => {
    expect(formatPercentage(0.1234)).toBe("12.34%");
    expect(formatPercentage(0)).toBe("0.00%");
    expect(formatPercentage(1)).toBe("100.00%");
    expect(formatPercentage(-0.4567)).toBe("-45.67%");
  });
});
