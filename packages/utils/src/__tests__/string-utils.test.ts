import {
  capitalize,
  escapeHtml,
  randomString,
  stripHtml,
  toCamelCase,
  toKebabCase,
  toPascalCase,
  toSnakeCase,
  truncate,
} from "../string-utils";
import { describe, expect, it } from "vitest";

describe("string utilities", () => {
  describe("toKebabCase", () => {
    it("should convert PascalCase to kebab-case", () => {
      expect(toKebabCase("HelloWorld")).toBe("hello-world");
    });

    it("should convert snake_case to kebab-case", () => {
      expect(toKebabCase("hello_world")).toBe("hello-world");
    });

    it("should convert spaces to kebab-case", () => {
      expect(toKebabCase("Hello World")).toBe("hello-world");
    });
  });

  describe("toCamelCase", () => {
    it("should convert kebab-case to camelCase", () => {
      expect(toCamelCase("hello-world")).toBe("helloWorld");
    });

    it("should convert snake_case to camelCase", () => {
      expect(toCamelCase("hello_world")).toBe("helloWorld");
    });

    it("should convert spaces to camelCase", () => {
      expect(toCamelCase("Hello World")).toBe("helloWorld");
    });
  });

  describe("toPascalCase", () => {
    it("should convert kebab-case to PascalCase", () => {
      expect(toPascalCase("hello-world")).toBe("HelloWorld");
    });

    it("should convert snake_case to PascalCase", () => {
      expect(toPascalCase("hello_world")).toBe("HelloWorld");
    });
  });

  describe("toSnakeCase", () => {
    it("should convert PascalCase to snake_case", () => {
      expect(toSnakeCase("HelloWorld")).toBe("hello_world");
    });

    it("should convert kebab-case to snake_case", () => {
      expect(toSnakeCase("hello-world")).toBe("hello_world");
    });
  });

  describe("capitalize", () => {
    it("should capitalize first letter", () => {
      expect(capitalize("hello world")).toBe("Hello world");
    });

    it("should handle uppercase strings", () => {
      expect(capitalize("HELLO WORLD")).toBe("Hello world");
    });
  });

  describe("truncate", () => {
    it("should truncate long strings", () => {
      expect(truncate("Hello world", 8)).toBe("Hello...");
    });

    it("should not truncate short strings", () => {
      expect(truncate("Hi", 5)).toBe("Hi");
    });

    it("should use custom suffix", () => {
      expect(truncate("Hello world", 7, "…")).toBe("Hello…");
    });
  });

  describe("randomString", () => {
    it("should generate string of specified length", () => {
      const result = randomString(8);
      expect(result).toHaveLength(8);
    });

    it("should use custom charset", () => {
      const result = randomString(4, "ABCD");
      expect(result).toMatch(/^[ABCD]{4}$/);
    });
  });

  describe("stripHtml", () => {
    it("should remove HTML tags", () => {
      expect(stripHtml("<p>Hello <strong>world</strong></p>")).toBe(
        "Hello world",
      );
    });
  });

  describe("escapeHtml", () => {
    it("should escape HTML special characters", () => {
      expect(escapeHtml('<script>alert("xss")</script>')).toBe(
        "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;",
      );
    });
  });
});
