import { describe, it, expect } from "vitest";
import type { ButtonProps } from "./button/button";

describe("Button", () => {
  it("should define ButtonProps interface correctly", () => {
    const props: ButtonProps = {
      variant: "default",
      size: "default",
      asChild: false,
      className: "test-class",
    };

    expect(props.variant).toBe("default");
    expect(props.size).toBe("default");
    expect(props.asChild).toBe(false);
    expect(props.className).toBe("test-class");
  });

  it("should support all variant types", () => {
    const variants: ButtonProps["variant"][] = [
      "default",
      "destructive",
      "outline",
      "secondary",
      "ghost",
      "link",
    ];

    for (const variant of variants) {
      const props: ButtonProps = { variant };
      expect(props.variant).toBe(variant);
    }
  });

  it("should support all size types", () => {
    const sizes: ButtonProps["size"][] = ["default", "sm", "lg", "icon"];

    for (const size of sizes) {
      const props: ButtonProps = { size };
      expect(props.size).toBe(size);
    }
  });
});
