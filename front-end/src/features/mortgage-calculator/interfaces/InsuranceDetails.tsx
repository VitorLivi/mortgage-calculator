import { CMHCInsurance } from "@/features/mortgage-calculator/types/mortgage";
import { formatCurrency, formatPercentage } from "@/shared/utils/currency";

interface InsuranceDetailsProps {
  cmhcInsurance?: CMHCInsurance;
}

export const InsuranceDetails: React.FC<InsuranceDetailsProps> = ({
  cmhcInsurance,
}) => {
  if (!cmhcInsurance || !cmhcInsurance.isRequired) return null;

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-lg font-semibold text-secondary-900">
          CMHC Insurance Details
        </h3>
      </div>
      <div className="card-body">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-secondary-600 mb-1">
              Insurance Rate
            </div>
            <div className="text-lg font-semibold text-secondary-900">
              {formatPercentage(cmhcInsurance.rate)}
            </div>
          </div>
          <div>
            <div className="text-sm text-secondary-600 mb-1">
              Insurance Premium
            </div>
            <div className="text-lg font-semibold text-secondary-900">
              {formatCurrency(cmhcInsurance.premium)}
            </div>
          </div>
          <div>
            <div className="text-sm text-secondary-600 mb-1">
              Total Cost (with tax)
            </div>
            <div className="text-lg font-semibold text-secondary-900">
              {formatCurrency(cmhcInsurance.totalCost)}
            </div>
          </div>
          <div>
            <div className="text-sm text-secondary-600 mb-1">
              Added to Mortgage
            </div>
            <div className="text-lg font-semibold text-secondary-900">Yes</div>
          </div>
        </div>
        <div className="mt-4 p-3 bg-info-50 border border-primary-200 rounded-lg">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-primary-600 mt-0.5 mr-2 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div className="text-sm text-primary-800">
              CMHC insurance premium is added to your mortgage principal and
              amortized over the life of the loan.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
