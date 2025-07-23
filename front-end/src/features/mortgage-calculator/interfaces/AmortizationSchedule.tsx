import { AmortizationEntry } from "@/features/mortgage-calculator/types/mortgage";
import { formatCurrency } from "@/shared/utils/currency";
import React, { useState } from "react";

interface AmortizationScheduleDetailsProps {
  showAmortizationSchedule: boolean;
  changeVisibility: () => void;
  amortizationSchedule: AmortizationEntry[];
}

export const AmortizationScheduleDetails: React.FC<
  AmortizationScheduleDetailsProps
> = ({ showAmortizationSchedule, changeVisibility, amortizationSchedule }) => {
  const [selectedYear, setSelectedYear] = useState<number>(1);

  const groupedSchedule = React.useMemo(() => {
    const grouped: { [year: number]: typeof amortizationSchedule } = {};

    amortizationSchedule.forEach((entry) => {
      const year = new Date(entry.paymentDate).getFullYear();
      const currentYear = new Date().getFullYear();
      const yearOffset = year - currentYear + 1;

      if (!grouped[yearOffset]) {
        grouped[yearOffset] = [];
      }
      grouped[yearOffset].push(entry);
    });

    return grouped;
  }, [amortizationSchedule]);

  const availableYears = Object.keys(groupedSchedule)
    .map(Number)
    .sort((a, b) => a - b);

  const yearSummary = React.useMemo(() => {
    const yearData = groupedSchedule[selectedYear] || [];
    const totalPrincipal = yearData.reduce(
      (sum, entry) => sum + entry.principalPayment,
      0
    );
    const totalInterest = yearData.reduce(
      (sum, entry) => sum + entry.interestPayment,
      0
    );
    const totalPayments = yearData.reduce(
      (sum, entry) => sum + entry.totalPayment,
      0
    );

    return {
      totalPrincipal,
      totalInterest,
      totalPayments,
      paymentsCount: yearData.length,
    };
  }, [groupedSchedule, selectedYear]);

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-secondary-900">
            Amortization Schedule
          </h3>
          <button
            onClick={() => changeVisibility()}
            className="btn btn-ghost btn-sm"
          >
            {showAmortizationSchedule ? "Hide" : "Show"} Schedule
            <svg
              className={`w-4 h-4 ml-1 transform transition-transform ${
                showAmortizationSchedule ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>

      {showAmortizationSchedule && (
        <div className="card-body">
          {availableYears.length > 1 && (
            <div className="mb-4">
              <label htmlFor="yearSelect" className="form-label">
                View Year
              </label>
              <select
                id="yearSelect"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="form-input max-w-xs"
              >
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    Year {year}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-secondary-50 rounded-lg">
              <div className="text-lg font-semibold text-secondary-900">
                {yearSummary.paymentsCount}
              </div>
              <div className="text-sm text-secondary-600">Payments</div>
            </div>
            <div className="text-center p-3 bg-success-50 rounded-lg">
              <div className="text-lg font-semibold text-success-700">
                {formatCurrency(yearSummary.totalPrincipal)}
              </div>
              <div className="text-sm text-success-600">Principal</div>
            </div>
            <div className="text-center p-3 bg-warning-50 rounded-lg">
              <div className="text-lg font-semibold text-warning-700">
                {formatCurrency(yearSummary.totalInterest)}
              </div>
              <div className="text-sm text-warning-600">Interest</div>
            </div>
            <div className="text-center p-3 bg-primary-50 rounded-lg">
              <div className="text-lg font-semibold text-primary-700">
                {formatCurrency(yearSummary.totalPayments)}
              </div>
              <div className="text-sm text-primary-600">Total</div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-secondary-200">
                  <th className="text-left py-2 px-3 text-sm font-medium text-secondary-600">
                    Payment #
                  </th>
                  <th className="text-left py-2 px-3 text-sm font-medium text-secondary-600">
                    Date
                  </th>
                  <th className="text-right py-2 px-3 text-sm font-medium text-secondary-600">
                    Principal
                  </th>
                  <th className="text-right py-2 px-3 text-sm font-medium text-secondary-600">
                    Interest
                  </th>
                  <th className="text-right py-2 px-3 text-sm font-medium text-secondary-600">
                    Total Payment
                  </th>
                  <th className="text-right py-2 px-3 text-sm font-medium text-secondary-600">
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody>
                {(groupedSchedule[selectedYear] || []).map((entry) => (
                  <tr
                    key={entry.paymentNumber}
                    className="border-b border-secondary-100 hover:bg-secondary-50"
                  >
                    <td className="py-2 px-3 text-sm text-secondary-900">
                      {entry.paymentNumber}
                    </td>
                    <td className="py-2 px-3 text-sm text-secondary-600">
                      {new Date(entry.paymentDate).toLocaleDateString("en-CA")}
                    </td>
                    <td className="py-2 px-3 text-sm text-right text-success-700 font-medium">
                      {formatCurrency(entry.principalPayment)}
                    </td>
                    <td className="py-2 px-3 text-sm text-right text-warning-700 font-medium">
                      {formatCurrency(entry.interestPayment)}
                    </td>
                    <td className="py-2 px-3 text-sm text-right text-secondary-900 font-medium">
                      {formatCurrency(entry.totalPayment)}
                    </td>
                    <td className="py-2 px-3 text-sm text-right text-secondary-600 font-mono">
                      {formatCurrency(entry.remainingBalance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {availableYears.length > 1 && (
            <div className="mt-4 text-center">
              <p className="text-sm text-secondary-500">
                Showing payments for year {selectedYear} of{" "}
                {Math.max(...availableYears)}. Use the dropdown above to view
                other years.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
