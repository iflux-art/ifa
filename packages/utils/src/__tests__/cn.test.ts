import { cn } from "../cn";
import { describe, expect, it } from "vitest";

describe("cn", () => {
  it("should merge class names", () => {
    expect(cn("px-4", "py-2", "bg-blue-500")).toBe("px-4 py-2 bg-blue-500");
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

  it("should deduplicate classes", () => {
    expect(cn("px-4 py-2", "px-4 bg-blue-500")).toBe("px-4 py-2 bg-blue-500");
  });
});
