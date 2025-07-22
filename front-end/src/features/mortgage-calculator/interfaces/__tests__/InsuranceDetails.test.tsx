import { render, screen } from "@testing-library/react";
import { InsuranceDetails } from "../InsuranceDetails";
import { describe, it, expect } from "vitest";

describe("InsuranceDetails", () => {
  const insuranceMock = {
    isRequired: true,
    rate: 0.04,
    premium: 14000,
    totalCost: 14500,
    monthlyPayment: 1200,
  };

  it("should not render when cmhcInsurance is undefined", () => {
    const { container } = render(<InsuranceDetails />);
    expect(container.firstChild).toBeNull();
  });

  it("should not render when isRequired is false", () => {
    const { container } = render(
      <InsuranceDetails
        cmhcInsurance={{ ...insuranceMock, isRequired: false }}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it("should render all insurance details when isRequired is true", () => {
    render(<InsuranceDetails cmhcInsurance={insuranceMock} />);

    expect(screen.getByText("CMHC Insurance Details")).toBeInTheDocument();
    expect(screen.getByText("Insurance Rate")).toBeInTheDocument();
    expect(screen.getByText("Insurance Premium")).toBeInTheDocument();
    expect(screen.getByText("Total Cost (with tax)")).toBeInTheDocument();
    expect(screen.getByText("Added to Mortgage")).toBeInTheDocument();

    expect(screen.getByText("4.00%")).toBeInTheDocument();
    expect(screen.getByText("$14,000.00")).toBeInTheDocument();
    expect(screen.getByText("$14,500.00")).toBeInTheDocument();

    expect(
      screen.getByText(/CMHC insurance premium is added/i)
    ).toBeInTheDocument();
  });
});
