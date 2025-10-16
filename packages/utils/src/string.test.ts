import { describe, it, expect } from "vitest";
import { capitalize, camelCase, kebabCase, truncate, titleCase } from "./string";

describe("string utilities", () => {
  describe("capitalize", () => {
    it("should capitalize first letter", () => {
      expect(capitalize("hello")).toBe("Hello");
      expect(capitalize("HELLO")).toBe("Hello");
      expect(capitalize("")).toBe("");
    });
  });

  describe("camelCase", () => {
    it("should convert to camelCase", () => {
      expect(camelCase("hello world")).toBe("helloWorld");
      expect(camelCase("test-example")).toBe("testExample");
    });
  });

  describe("kebabCase", () => {
    it("should convert to kebab-case", () => {
      expect(kebabCase("Hello World")).toBe("hello-world");
      expect(kebabCase("testExample")).toBe("test-example");
    });
  });

  describe("truncate", () => {
    it("should truncate long strings", () => {
      const longText = "This is a very long text that should be truncated";
      const truncated = truncate(longText, 10);
      expect(truncated).toHaveLength(10); // Total length including '...'
      expect(truncated).toBe("This is...");
      expect(truncate("short", 10)).toBe("short");
    });
  });

  describe("titleCase", () => {
    it("should convert to title case", () => {
      expect(titleCase("hello world")).toBe("Hello World");
      expect(titleCase("test example")).toBe("Test Example");
    });
  });
});
