import React from "react";
import { clsx } from "clsx";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  color?: "primary" | "secondary" | "white";
  className?: string;
  text?: string;
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-12 h-12",
};

const colorClasses = {
  primary: "text-primary-600",
  secondary: "text-secondary-600",
  white: "text-white",
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  color = "primary",
  className,
  text,
}) => {
  return (
    <div
      className={clsx("flex flex-col items-center justify-center", className)}
    >
      <div
        className={clsx(
          "animate-spin border-2 border-current border-t-transparent rounded-full",
          sizeClasses[size],
          colorClasses[color]
        )}
        role="status"
        aria-label="Loading"
      />
      {text && (
        <p className="mt-2 text-sm text-secondary-600 animate-pulse">{text}</p>
      )}
    </div>
  );
};

// Alternative spinner with dots
export const LoadingDots: React.FC<{ className?: string }> = ({
  className,
}) => {
  return (
    <div className={clsx("flex space-x-1", className)}>
      <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" />
      <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce delay-75" />
      <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce delay-150" />
    </div>
  );
};

// Full page loading overlay
export const LoadingOverlay: React.FC<{
  isVisible: boolean;
  text?: string;
}> = ({ isVisible, text = "Loading..." }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-xl">
        <LoadingSpinner size="lg" text={text} />
      </div>
    </div>
  );
};

// Skeleton loader for content
export const SkeletonLoader: React.FC<{
  className?: string;
  lines?: number;
}> = ({ className, lines = 3 }) => {
  return (
    <div className={clsx("animate-pulse", className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={clsx(
            "h-4 bg-secondary-200 rounded mb-2",
            index === lines - 1 ? "w-3/4" : "w-full"
          )}
        />
      ))}
    </div>
  );
};
