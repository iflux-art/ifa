import { describe, it, expect } from "vitest";
import {
  validateEnvironmentVariables,
  createEnvironmentSchema,
  EnvironmentChecker,
} from "./validation";

describe("validation", () => {
  it("should validate environment variables", () => {
    expect(typeof validateEnvironmentVariables).toBe("function");

    const result = validateEnvironmentVariables(
      { NODE_ENV: "test", JWT_SECRET: "test-secret-key-that-is-long-enough" },
      "test"
    );

    expect(result).toBeDefined();
    expect(typeof result.isValid).toBe("boolean");
    expect(Array.isArray(result.errors)).toBe(true);
    expect(Array.isArray(result.warnings)).toBe(true);
  });

  it("should create environment schema", () => {
    expect(typeof createEnvironmentSchema).toBe("function");

    const schema = createEnvironmentSchema("development");
    expect(schema).toBeDefined();
  });

  it("should create environment checker", () => {
    expect(typeof EnvironmentChecker).toBe("function");

    const checker = new EnvironmentChecker("test", {
      NODE_ENV: "test",
      JWT_SECRET: "test-secret-key-that-is-long-enough",
    });

    expect(checker).toBeDefined();
    expect(typeof checker.checkRequired).toBe("function");
  });
});
