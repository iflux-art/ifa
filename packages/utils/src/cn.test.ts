import { describe, expect, it } from "vitest";
import { cn } from "./cn";

describe("cn utility function", () => {
  it("should merge class names correctly", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });

  it("should handle conditional classes", () => {
    expect(cn("base", true && "conditional", false && "hidden")).toBe(
      "base conditional",
    );
  });

  it("should handle empty inputs", () => {
    expect(cn()).toBe("");
    expect(cn("")).toBe("");
    expect(cn(null, undefined)).toBe("");
  });

  it("should handle arrays", () => {
    expect(cn(["px-2", "py-1"], "px-4")).toBe("py-1 px-4");
  });
});
