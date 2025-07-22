import { describe, it, expect } from "vitest";

const formatDate = (date: Date | null) => {
  if (!date) return "";

  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

describe("formatDate", () => {
  it("returns an empty string if the date is null", () => {
    expect(formatDate(null)).toBe("");
  });

  it("formats the date correctly for a valid Date object", () => {
    const testDate = new Date("2025-07-22T15:30:00Z");

    const expected = new Intl.DateTimeFormat("en-CA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(testDate);

    expect(formatDate(testDate)).toBe(expected);
  });
});
