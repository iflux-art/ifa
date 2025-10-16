import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { loadEnvConfig, getEnv, isDevelopment, isProduction, isTest } from "./env";

describe("env", () => {
  const originalEnv = process.env;

  beforeAll(() => {
    // Set required environment variables for testing
    process.env = {
      ...originalEnv,
      NODE_ENV: "test",
      JWT_SECRET: "test-jwt-secret-key-that-is-long-enough-for-validation",
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("should load environment configuration", () => {
    expect(typeof loadEnvConfig).toBe("function");
    const config = loadEnvConfig();
    expect(config).toBeDefined();
    expect(config.NODE_ENV).toBe("test");
    expect(config.JWT_SECRET).toBeDefined();
  });

  it("should get environment variables with fallback", () => {
    const nodeEnv = getEnv("NODE_ENV", "development");
    expect(nodeEnv).toBe("test");

    const port = getEnv("PORT", "3000");
    expect(port).toBeDefined();
  });

  it("should detect environment types", () => {
    expect(typeof isDevelopment).toBe("function");
    expect(typeof isProduction).toBe("function");
    expect(typeof isTest).toBe("function");

    // These should return boolean values
    expect(typeof isDevelopment()).toBe("boolean");
    expect(typeof isProduction()).toBe("boolean");
    expect(typeof isTest()).toBe("boolean");

    // In test environment, isTest should return true
    expect(isTest()).toBe(true);
    expect(isDevelopment()).toBe(false);
    expect(isProduction()).toBe(false);
  });
});
