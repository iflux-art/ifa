import { describe, expect, it } from "vitest";
import { cn } from "./cn";

describe("cn utility function", () => {
  it("should merge class names correctly", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("px-2 py-1 px-4");
  });

  it("should handle conditional classes", () => {
    expect(cn("px-4", { "py-2": true, "bg-red-500": false })).toBe("px-4 py-2");
  });

  it("should handle arrays", () => {
    expect(cn(["px-2", "py-1"], "px-4")).toBe("px-2 py-1 px-4");
  });

  it("should handle empty values", () => {
    expect(cn("px-4", null, undefined, "", "py-2")).toBe("px-4 py-2");
  });
});
