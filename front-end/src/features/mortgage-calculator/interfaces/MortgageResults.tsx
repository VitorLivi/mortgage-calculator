import React, { useState } from "react";
import { MortgageCalculationResult } from "@/features/mortgage-calculator/types/mortgage";
import { formatCurrency } from "@/shared/utils/currency";
import { InsuranceDetails } from "../interfaces/InsuranceDetails";
import { PaymentBreakdownDetails } from "../interfaces/PaymentBreakdown";
import { AmortizationScheduleDetails } from "../interfaces/AmortizationSchedule";
import { formatDate } from "@/shared/utils/date";

interface MortgageResultsProps {
  result: MortgageCalculationResult;
  lastCalculated: Date | null;
  onRecalculate: () => void;
}

export const MortgageResults: React.FC<MortgageResultsProps> = ({
  result,
  lastCalculated,
  onRecalculate,
}) => {
  const [showAmortizationSchedule, setShowAmortizationSchedule] =
    useState(false);

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-secondary-900">
              Payment Results
            </h3>
            {lastCalculated && (
              <span className="text-sm text-secondary-500">
                {formatDate(lastCalculated)}
              </span>
            )}
          </div>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center p-4 bg-primary-50 rounded-lg">
              <div className="text-3xl font-bold text-primary-700 mb-1">
                {formatCurrency(result.paymentAmount)}
              </div>
              <div className="text-sm text-primary-600">Per Payment</div>
            </div>

            <div className="text-center p-4 bg-warning-50 rounded-lg">
              <div className="text-3xl font-bold text-warning-700 mb-1">
                {formatCurrency(result.totalInterest)}
              </div>
              <div className="text-sm text-warning-600">Total Interest</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div className="text-center">
              <div className="text-lg font-semibold text-secondary-900">
                {formatCurrency(result.principalAmount)}
              </div>
              <div className="text-sm text-secondary-600">Principal Amount</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-secondary-900">
                {formatCurrency(result.principalAmount + result.totalInterest)}
              </div>
              <div className="text-sm text-secondary-600">Total Cost</div>
            </div>
          </div>
        </div>
      </div>

      <InsuranceDetails cmhcInsurance={result.cmhcInsurance} />
      <PaymentBreakdownDetails paymentBreakdown={result.paymentBreakdown} />
      <AmortizationScheduleDetails
        changeVisibility={() =>
          setShowAmortizationSchedule(!showAmortizationSchedule)
        }
        showAmortizationSchedule={showAmortizationSchedule}
        amortizationSchedule={result.amortizationSchedule}
      />

      <div className="text-center">
        <button onClick={onRecalculate} className="btn btn-outline">
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Calculate Different Scenario
        </button>
      </div>
    </div>
  );
};
