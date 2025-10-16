import { describe, it, expect } from "vitest";
import type { ApiResponse, ApiError, PaginationParams, SearchParams } from "./api";

describe("API types", () => {
  it("should define ApiResponse type correctly", () => {
    const response: ApiResponse<string> = {
      data: "test",
      success: true,
      message: "Success",
      timestamp: new Date().toISOString(),
    };

    expect(response.data).toBe("test");
    expect(response.success).toBe(true);
    expect(response.timestamp).toBeDefined();
  });

  it("should define ApiError type correctly", () => {
    const error: ApiError = {
      code: "TEST_ERROR",
      message: "Test error message",
      details: { field: "test" },
    };

    expect(error.code).toBe("TEST_ERROR");
    expect(error.message).toBe("Test error message");
  });

  it("should define PaginationParams type correctly", () => {
    const params: PaginationParams = {
      page: 1,
      limit: 10,
      offset: 0,
    };

    expect(params.page).toBe(1);
    expect(params.limit).toBe(10);
  });

  it("should define SearchParams type correctly", () => {
    const searchParams: SearchParams = {
      page: 1,
      limit: 20,
      query: "test search",
      sort: [{ field: "name", order: "asc" }],
    };

    expect(searchParams.query).toBe("test search");
    expect(searchParams.sort?.[0].field).toBe("name");
  });
});
