import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  MortgageInput,
  PaymentSchedule,
  MortgageValidationError,
  AMORTIZATION_PERIODS,
} from "@/features/mortgage-calculator/types/mortgage";

const MAX_INSURED_PRICE = 1_500_000;

const mortgageSchema = z
  .object({
    propertyPrice: z
      .string()
      .min(1, "Property price is required")
      .transform((val) => parseFloat(val.replace(/[,$]/g, "")))
      .refine((num) => !isNaN(num) && num > 0, {
        message: `Property price must be greater than $0`,
      }),

    downPayment: z
      .string()
      .min(1, "Down payment is required")
      .transform((val) => parseFloat(val.replace(/[,$]/g, "")))
      .refine((num) => !isNaN(num) && num > 0, {
        message: "Down payment must be greater than $0",
      }),

    annualInterestRate: z
      .string()
      .min(1, "Interest rate is required")
      .refine(
        (val) => {
          const num = parseFloat(val);
          return !isNaN(num) && num >= 0 && num <= 30;
        },
        { message: "Interest rate must be between 0% and 30%" }
      ),

    amortizationPeriod: z
      .string()
      .min(1, "Amortization period is required")
      .transform((val) => parseInt(val))
      .refine((num) => AMORTIZATION_PERIODS.includes(num as any), {
        message: "Please select a valid amortization period",
      }),

    paymentSchedule: z.nativeEnum(PaymentSchedule, {
      errorMap: () => ({ message: "Please select a payment schedule" }),
    }),
  })
  .superRefine((data, ctx) => {
    const { propertyPrice, downPayment, amortizationPeriod } = data;
    const dpPct = downPayment / propertyPrice;

    if (downPayment > propertyPrice) {
      ctx.addIssue({
        path: ["downPayment"],
        message: "Down payment cannot exceed property price",
      });
    }

    if (propertyPrice <= 500_000) {
      if (dpPct < 0.05) {
        ctx.addIssue({
          path: ["downPayment"],
          message: "Minimum 5% down payment required",
        });
      }
    } else if (propertyPrice <= 1_500_000) {
      const needed =
        0.05 +
        (propertyPrice > 500_000
          ? ((propertyPrice - 500_000) / propertyPrice) * 0.05
          : 0);
      if (dpPct < needed) {
        ctx.addIssue({
          path: ["downPayment"],
          message: `Minimum down payment is 5% up to $500k and 10% on the excess — you need at least ${(
            needed * 100
          ).toFixed(2)}%`,
        });
      }
    } else {
      if (dpPct < 0.2) {
        ctx.addIssue({
          path: ["downPayment"],
          message: "For homes over $1.5M, minimum 20% down is required",
        });
      }
    }

    if (dpPct < 0.2 && propertyPrice < MAX_INSURED_PRICE) {
      if (amortizationPeriod > 25) {
        ctx.addIssue({
          path: ["amortizationPeriod"],
          message:
            "For insured mortgages (down <20%), max amortization is 25 years unless first-time/new home",
        });
      }
    }
  });

type MortgageFormData = z.infer<typeof mortgageSchema>;

interface MortgageFormProps {
  onCalculate: (input: MortgageInput) => void;
  onReset: () => void;
  errors: MortgageValidationError[];
  isLoading: boolean;
}

export const MortgageForm: React.FC<MortgageFormProps> = ({
  onCalculate,
  onReset,
  errors,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors: formErrors, isValid },
  } = useForm<MortgageFormData>({
    resolver: zodResolver(mortgageSchema),
    defaultValues: {
      propertyPrice: 0,
      downPayment: 0,
      annualInterestRate: "3.89",
      amortizationPeriod: 25,
      paymentSchedule: PaymentSchedule.MONTHLY,
    },
    mode: "onChange",
  });

  const propertyPrice = watch("propertyPrice");
  const downPayment = watch("downPayment");

  const formatCurrencyInput = (value: string): string => {
    const num = value.replace(/[^\d.]/g, "");
    if (!num) return "";
    const numValue = parseFloat(num);
    if (isNaN(numValue)) return "";
    return numValue.toLocaleString("en-CA", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const handleCurrencyInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: "propertyPrice" | "downPayment"
  ) => {
    const formatted = formatCurrencyInput(e.target.value);
    setValue(fieldName, formatted, { shouldValidate: true });
  };

  const handlePercentageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d.]/g, "");
    setValue("annualInterestRate", value, { shouldValidate: true });
  };

  const onSubmit = (data: MortgageFormData) => {
    const input: MortgageInput = {
      propertyPrice: data.propertyPrice,
      downPayment: data.downPayment,
      annualInterestRate: parseFloat(data.annualInterestRate),
      amortizationPeriod: data.amortizationPeriod,
      paymentSchedule: data.paymentSchedule,
    };

    onCalculate(input);
  };

  const handleReset = () => {
    reset();
    onReset();
  };

  const downPaymentPercentage = React.useMemo(() => {
    const price = parseFloat(
      propertyPrice?.toString().replace(/,/g, "") ?? "0"
    );
    const down = parseFloat(downPayment?.toString().replace(/,/g, "") ?? "0");

    if (price > 0 && down > 0) {
      return ((down / price) * 100).toFixed(1);
    }

    return null;
  }, [propertyPrice, downPayment]);

  const getApiError = (fieldName: keyof MortgageInput | string) => {
    return errors.find((error) => error.field === fieldName)?.message;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="form-group">
        <label htmlFor="propertyPrice" className="form-label">
          Property Price *
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-500 font-medium">
            $
          </span>
          <input
            {...register("propertyPrice")}
            maxLength={15}
            type="text"
            id="propertyPrice"
            className={`form-input pl-8 ${
              formErrors.propertyPrice || getApiError("propertyPrice")
                ? "border-error-500 focus:border-error-500 focus:ring-error-500"
                : ""
            }`}
            placeholder="500,000"
            onChange={(e) => handleCurrencyInput(e, "propertyPrice")}
            disabled={isLoading}
          />
        </div>
        {formErrors.propertyPrice && (
          <p className="form-error">{formErrors.propertyPrice.message}</p>
        )}
        {getApiError("propertyPrice") && (
          <p className="form-error">{getApiError("propertyPrice")}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="downPayment" className="form-label">
          Down Payment *
          {downPaymentPercentage && (
            <span className="ml-2 text-sm font-normal text-secondary-500">
              ({downPaymentPercentage}%)
            </span>
          )}
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-500 font-medium">
            $
          </span>
          <input
            {...register("downPayment")}
            maxLength={15}
            type="text"
            id="downPayment"
            className={`form-input pl-8 ${
              formErrors.downPayment || getApiError("downPayment")
                ? "border-error-500 focus:border-error-500 focus:ring-error-500"
                : ""
            }`}
            placeholder="100,000"
            onChange={(e) => handleCurrencyInput(e, "downPayment")}
            disabled={isLoading}
          />
        </div>
        {formErrors.downPayment && (
          <p className="form-error">{formErrors.downPayment.message}</p>
        )}
        {getApiError("downPayment") && (
          <p className="form-error">{getApiError("downPayment")}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="annualInterestRate" className="form-label">
          Annual Interest Rate *
        </label>
        <div className="relative">
          <input
            {...register("annualInterestRate")}
            type="text"
            id="annualInterestRate"
            className={`form-input pr-8 ${
              formErrors.annualInterestRate || getApiError("annualInterestRate")
                ? "border-error-500 focus:border-error-500 focus:ring-error-500"
                : ""
            }`}
            placeholder="5.25"
            onChange={handlePercentageInput}
            disabled={isLoading}
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-500 font-medium">
            %
          </span>
        </div>
        {formErrors.annualInterestRate && (
          <p className="form-error">{formErrors.annualInterestRate.message}</p>
        )}
        {getApiError("annualInterestRate") && (
          <p className="form-error">{getApiError("annualInterestRate")}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="amortizationPeriod" className="form-label">
          Amortization Period *
        </label>
        <select
          {...register("amortizationPeriod")}
          id="amortizationPeriod"
          className={`form-input ${
            formErrors.amortizationPeriod || getApiError("amortizationPeriod")
              ? "border-error-500 focus:border-error-500 focus:ring-error-500"
              : ""
          }`}
          disabled={isLoading}
        >
          {AMORTIZATION_PERIODS.map((period) => (
            <option key={period} value={period}>
              {period} years
            </option>
          ))}
        </select>
        {formErrors.amortizationPeriod && (
          <p className="form-error">{formErrors.amortizationPeriod.message}</p>
        )}
        {getApiError("amortizationPeriod") && (
          <p className="form-error">{getApiError("amortizationPeriod")}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="paymentSchedule" className="form-label">
          Payment Schedule *
        </label>
        <select
          {...register("paymentSchedule")}
          id="paymentSchedule"
          className={`form-input ${
            formErrors.paymentSchedule || getApiError("paymentSchedule")
              ? "border-error-500 focus:border-error-500 focus:ring-error-500"
              : ""
          }`}
          disabled={isLoading}
        >
          <option value={PaymentSchedule.MONTHLY}>Monthly</option>
          <option value={PaymentSchedule.BI_WEEKLY}>Bi-weekly</option>
          <option value={PaymentSchedule.ACCELERATED_BI_WEEKLY}>
            Accelerated Bi-weekly
          </option>
        </select>
        {formErrors.paymentSchedule && (
          <p className="form-error">{formErrors.paymentSchedule.message}</p>
        )}
        {getApiError("paymentSchedule") && (
          <p className="form-error">{getApiError("paymentSchedule")}</p>
        )}
        <p className="mt-1 text-xs text-secondary-500">
          Accelerated bi-weekly payments can reduce your amortization period
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          type="submit"
          disabled={!isValid || isLoading}
          className="btn btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Calculating...
            </>
          ) : (
            <>
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
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              Calculate Mortgage
            </>
          )}
        </button>
        <button
          type="button"
          onClick={handleReset}
          disabled={isLoading}
          className="btn btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
        >
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
          Reset
        </button>
      </div>

      {errors.length > 0 &&
        errors.some(
          (error) => !error.field || (error.field as string) === "general"
        ) && (
          <div className="alert alert-error">
            <div className="flex items-center">
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                {
                  errors.find(
                    (e) => !e.field || (e.field as string) === "general"
                  )?.message
                }
              </span>
            </div>
          </div>
        )}
    </form>
  );
};
