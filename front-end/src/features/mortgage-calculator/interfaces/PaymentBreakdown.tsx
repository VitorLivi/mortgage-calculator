import { PaymentBreakdown } from "@/features/mortgage-calculator/types/mortgage";
import { formatCurrency } from "@/shared/utils/currency";
import React from "react";

interface PaymentBreakdownDetailsProps {
  paymentBreakdown: PaymentBreakdown;
}

export const PaymentBreakdownDetails: React.FC<
  PaymentBreakdownDetailsProps
> = ({ paymentBreakdown }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-lg font-semibold text-secondary-900">
          Payment Breakdown
        </h3>
      </div>
      <div className="card-body">
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-secondary-100">
            <span className="text-secondary-600">Principal</span>
            <span className="font-semibold text-secondary-900">
              {formatCurrency(paymentBreakdown.principal)}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-secondary-100">
            <span className="text-secondary-600">Interest</span>
            <span className="font-semibold text-secondary-900">
              {formatCurrency(paymentBreakdown.interest)}
            </span>
          </div>
          {paymentBreakdown.cmhcInsurance > 0 && (
            <div className="flex justify-between items-center py-2 border-b border-secondary-100">
              <span className="text-secondary-600">CMHC Insurance</span>
              <span className="font-semibold text-secondary-900">
                {formatCurrency(paymentBreakdown.cmhcInsurance)}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center py-2 pt-3 border-t-2 border-secondary-200">
            <span className="font-semibold text-secondary-900">
              Total Payment
            </span>
            <span className="font-bold text-primary-700 text-lg">
              {formatCurrency(paymentBreakdown.totalPayment)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
