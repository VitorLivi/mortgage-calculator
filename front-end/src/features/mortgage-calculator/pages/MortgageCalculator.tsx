import React, { useState, useCallback } from "react";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";
import { calculateMortgage } from "@/shared/api/mortgage";
import { CalculatorState, MortgageInput } from "../types/mortgage";
import { MortgageForm } from "../interfaces/MortgageForm";
import { MortgageResults } from "../interfaces/MortgageResults";

export const MortgageCalculator: React.FC = () => {
  const [state, setState] = useState<CalculatorState>({
    isLoading: false,
    result: null,
    errors: [],
    lastCalculation: null,
  });

  const handleCalculate = useCallback(async (input: MortgageInput) => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
      errors: [],
    }));

    try {
      if (process.env.NODE_ENV === "development") {
        await new Promise((resolve) => setTimeout(resolve, 800));
      }

      const result = await calculateMortgage(input);

      setState({
        isLoading: false,
        result,
        errors: [],
        lastCalculation: new Date(),
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";

      setState((prev) => ({
        ...prev,
        isLoading: false,
        errors: [
          {
            field: "propertyPrice",
            message: errorMessage,
            code: "CALCULATION_ERROR",
          },
        ],
      }));
    }
  }, []);

  const handleReset = useCallback(() => {
    setState({
      isLoading: false,
      result: null,
      errors: [],
      lastCalculation: null,
    });
  }, []);

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="bg-gradient-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Mortgage Calculator
            </h1>
            <p className="mt-4 text-xl text-primary-100 max-w-3xl mx-auto">
              Calculate your monthly mortgage payments with CMHC insurance
              considerations. Get accurate estimates for your home purchase in
              Canada.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="order-2 lg:order-1">
            <div className="card">
              <div className="card-header">
                <h2 className="text-2xl font-semibold text-secondary-900">
                  Mortgage Details
                </h2>
                <p className="text-secondary-600 mt-1">
                  Enter your mortgage information to calculate your payments
                </p>
              </div>
              <div className="card-body">
                {state.isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <LoadingSpinner
                      size="lg"
                      text="Calculating your mortgage..."
                    />
                  </div>
                ) : (
                  <MortgageForm
                    onCalculate={handleCalculate}
                    onReset={handleReset}
                    errors={state.errors}
                    isLoading={state.isLoading}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            {state.result ? (
              <MortgageResults
                result={state.result}
                lastCalculated={state.lastCalculation}
                onRecalculate={() => handleReset()}
              />
            ) : (
              <div className="card">
                <div className="card-body">
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-secondary-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-secondary-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-secondary-900 mb-2">
                      Ready to Calculate
                    </h3>
                    <p className="text-secondary-600">
                      Fill in the form on the left to see your mortgage payment
                      calculations and amortization schedule.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
