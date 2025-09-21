import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Logo } from "./logo";

describe("Logo", () => {
  it("应该正确渲染默认文本", () => {
    render(<Logo />);
    expect(screen.getByText("iFluxArt")).toBeInTheDocument();
  });

  it("应该正确渲染自定义文本", () => {
    render(<Logo text="Custom Logo" />);
    expect(screen.getByText("Custom Logo")).toBeInTheDocument();
  });

  it("应该正确渲染内部链接", () => {
    render(<Logo href="/about" />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/about");
  });

  it("应该正确渲染外部链接", () => {
    render(<Logo href="https://example.com" isExternal />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("应该正确应用自定义类名", () => {
    render(<Logo className="custom-class" />);
    const link = screen.getByRole("link");
    expect(link).toHaveClass("custom-class");
  });

  it("应该正确设置 ARIA 标签", () => {
    render(<Logo ariaLabel="自定义标签" />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("aria-label", "自定义标签");
  });
});