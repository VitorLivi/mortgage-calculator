import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  LoadingSpinner,
  LoadingDots,
  LoadingOverlay,
  SkeletonLoader,
} from "../LoadingSpinner";

describe("LoadingSpinner", () => {
  it("renders with default props", () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByTestId("loading-spinner");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass(
      "animate-spin",
      "w-6",
      "h-6",
      "text-primary-600"
    );

    const wrapper = screen.getByTestId("loading-spinner-wrapper");
    expect(wrapper).toHaveClass(
      "flex",
      "flex-col",
      "items-center",
      "justify-center"
    );

    expect(screen.queryByTestId("loading-spinner-text")).toBeNull();
  });

  it("renders with custom size, color, className, and text", () => {
    render(
      <LoadingSpinner
        size="xl"
        color="white"
        className="custom-class"
        text="Loading data..."
      />
    );

    const spinner = screen.getByTestId("loading-spinner");
    expect(spinner).toHaveClass("w-12", "h-12", "text-white");

    const wrapper = screen.getByTestId("loading-spinner-wrapper");
    expect(wrapper).toHaveClass("custom-class");

    const text = screen.getByTestId("loading-spinner-text");
    expect(text).toBeInTheDocument();
    expect(text).toHaveTextContent("Loading data...");
    expect(text).toHaveClass("animate-pulse");
  });
});

describe("LoadingDots", () => {
  it("renders three bouncing dots", () => {
    render(<LoadingDots />);
    const container = screen.getByTestId("loading-dots");
    expect(container).toBeInTheDocument();
    expect(container.children.length).toBe(3);
  });

  it("applies custom className", () => {
    render(<LoadingDots className="custom-dots" />);
    const container = screen.getByTestId("loading-dots");
    expect(container).toHaveClass("custom-dots");
  });
});

describe("LoadingOverlay", () => {
  it("does not render when isVisible is false", () => {
    const { container } = render(<LoadingOverlay isVisible={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders overlay with spinner and text when visible", () => {
    render(<LoadingOverlay isVisible={true} text="Please wait..." />);
    const overlay = screen.getByTestId("loading-overlay");
    expect(overlay).toBeInTheDocument();
    expect(screen.getByText("Please wait...")).toBeInTheDocument();
    const spinner = screen.getByTestId("loading-spinner");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass("w-8", "h-8"); // size lg -> 8
  });

  it("renders default text when none provided", () => {
    render(<LoadingOverlay isVisible={true} />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});

describe("SkeletonLoader", () => {
  it("renders default 3 lines", () => {
    render(<SkeletonLoader />);
    const loader = screen.getByTestId("skeleton-loader");
    expect(loader).toBeInTheDocument();
    // Existem 3 divs internas
    expect(loader.children.length).toBe(3);
  });

  it("renders custom number of lines", () => {
    render(<SkeletonLoader lines={5} />);
    const loader = screen.getByTestId("skeleton-loader");
    expect(loader.children.length).toBe(5);
  });

  it("applies custom className", () => {
    render(<SkeletonLoader className="custom-skeleton" />);
    const loader = screen.getByTestId("skeleton-loader");
    expect(loader).toHaveClass("custom-skeleton");
  });

  it("last line has different width class", () => {
    render(<SkeletonLoader lines={4} />);
    const loader = screen.getByTestId("skeleton-loader");
    const children = loader.children;
    for (let i = 0; i < children.length - 1; i++) {
      expect(children[i].className).toMatch(/w-full/);
    }
    expect(children[children.length - 1].className).toMatch(/w-3\/4/);
  });
});
