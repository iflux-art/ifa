import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { Label } from "../components/label";

// Component to use useId hook safely
function LabelTestComponent() {
  const testId = React.useId();
  return (
    <div>
      <Label htmlFor={testId}>Test Label</Label>
      <input id={testId} />
    </div>
  );
}

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
    render(<LabelTestComponent />);

    const label = screen.getByText("Test Label");
    const input = screen.getByRole("textbox");

    // Check that both elements have the same ID
    const labelFor = label.getAttribute("for");
    const inputId = input.getAttribute("id");

    expect(labelFor).toBeTruthy();
    expect(inputId).toBeTruthy();
    expect(labelFor).toBe(inputId);
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
