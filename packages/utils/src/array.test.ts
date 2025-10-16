import { describe, it, expect } from "vitest";
import { chunk, uniqueBy, groupBy, safeArrayAccess, moveArrayItem } from "./array";

describe("array utilities", () => {
  describe("chunk", () => {
    it("should split array into chunks", () => {
      const arr = [1, 2, 3, 4, 5];
      expect(chunk(arr, 2)).toEqual([[1, 2], [3, 4], [5]]);
      expect(chunk([], 2)).toEqual([]);
    });
  });

  describe("uniqueBy", () => {
    it("should remove duplicates by key function", () => {
      const items = [
        { id: 1, name: "apple" },
        { id: 2, name: "banana" },
        { id: 1, name: "apple duplicate" },
      ];
      const unique = uniqueBy(items, (item) => item.id);
      expect(unique).toHaveLength(2);
      expect(unique[0].name).toBe("apple");
    });
  });

  describe("groupBy", () => {
    it("should group items by key function", () => {
      const items = [
        { type: "fruit", name: "apple" },
        { type: "fruit", name: "banana" },
        { type: "vegetable", name: "carrot" },
      ];

      const grouped = groupBy(items, (item) => item.type);
      expect(grouped.fruit).toHaveLength(2);
      expect(grouped.vegetable).toHaveLength(1);
    });
  });

  describe("safeArrayAccess", () => {
    it("should safely access array elements", () => {
      const arr = [1, 2, 3];
      expect(safeArrayAccess(arr, 1)).toBe(2);
      expect(safeArrayAccess(arr, 10)).toBeUndefined();
      expect(safeArrayAccess(arr, -1)).toBeUndefined();
    });
  });

  describe("moveArrayItem", () => {
    it("should move items within array", () => {
      const arr = [1, 2, 3, 4, 5];
      const moved = moveArrayItem(arr, 0, 2);
      expect(moved).toEqual([2, 3, 1, 4, 5]);
    });
  });
});
