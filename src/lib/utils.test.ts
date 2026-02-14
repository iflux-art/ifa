import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("utils", () => {
	describe("cn", () => {
		it("should merge class names", () => {
			expect(cn("class1", "class2")).toBe("class1 class2");
			expect(cn("class1", undefined, "class2")).toBe("class1 class2");
		});

		it("should handle conditional classes", () => {
			expect(cn("base", true && "conditional")).toBe("base conditional");
			expect(cn("base", false && "conditional")).toBe("base");
		});
	});
});
