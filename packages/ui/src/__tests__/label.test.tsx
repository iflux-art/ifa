import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Label } from "../components/label";
import { useId } from "react";

describe("Label", () => {
  it("renders correctly", () => {
    render(<Label>Label Text</Label>);
    expect(screen.getByText("Label Text")).toBeInTheDocument();
  });

  it("applies correct CSS classes", () => {
    render(<Label data-testid="label">Label</Label>);
    const label = screen.getByTestId("label");

    expect(label).toHaveClass(
      "text-sm",
      "font-medium",
      "leading-none",
      "peer-disabled:cursor-not-allowed",
      "peer-disabled:opacity-70",
    );
  });

  it("accepts custom className", () => {
    render(
      <Label className="custom-class" data-testid="label">
        Label
      </Label>,
    );
    expect(screen.getByTestId("label")).toHaveClass("custom-class");
  });

  it("can be associated with form controls", () => {
    const testId = useId();
    render(
      <div>
        <Label htmlFor={testId}>Test Label</Label>
        <input id={testId} />
      </div>,
    );

    const label = screen.getByText("Test Label");
    const input = screen.getByRole("textbox");

    expect(label).toHaveAttribute("for", testId);
    expect(input).toHaveAttribute("id", testId);
  });

  it("forwards ref correctly", () => {
    const ref = { current: null };
    render(
      <Label ref={ref} data-testid="label">
        Label
      </Label>,
    );

    expect(ref.current).toBe(screen.getByTestId("label"));
  });
});
