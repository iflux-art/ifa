import { describe, expect, it } from "vitest";
import { formatDate, formatRelativeTime } from "../format-date";

describe("formatDate", () => {
  const testDate = new Date("2023-12-25T14:30:00Z");

  it("should format date with default options", () => {
    const result = formatDate(testDate);
    expect(result).toMatch(/Dec 25, 2023/);
  });

  it("should include time when requested", () => {
    const result = formatDate(testDate, { includeTime: true });
    expect(result).toMatch(/Dec 25, 2023/);
    expect(result).toMatch(/PM|AM/);
  });

  it("should handle different date styles", () => {
    const result = formatDate(testDate, { dateStyle: "full" });
    expect(result).toMatch(/Monday/);
    expect(result).toMatch(/December/);
  });

  it("should throw error for invalid date", () => {
    expect(() => formatDate("invalid-date")).toThrow("Invalid date provided");
  });
});

describe("formatRelativeTime", () => {
  it("should format past dates", () => {
    const pastDate = new Date(Date.now() - 1000 * 60 * 60 * 2); // 2 hours ago
    const result = formatRelativeTime(pastDate);
    expect(result).toMatch(/2 hours ago/);
  });

  it("should format future dates", () => {
    const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 24); // 1 day from now
    const result = formatRelativeTime(futureDate);
    // The actual output depends on the browser implementation, could be "tomorrow" or "in 1 day"
    expect(result).toMatch(/tomorrow|in 1 day/);
  });

  it("should handle recent dates", () => {
    const recentDate = new Date(Date.now() - 1000 * 30); // 30 seconds ago
    const result = formatRelativeTime(recentDate);
    expect(result).toMatch(/30 seconds ago/);
  });
});
