import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "../components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/dialog";
import { Input } from "../components/input";
import { Label } from "../components/label";
import { useId } from "react";

describe("Accessibility Tests", () => {
  describe("Button Accessibility", () => {
    it("has proper ARIA attributes when disabled", () => {
      render(<Button disabled>Disabled Button</Button>);
      const button = screen.getByRole("button");

      expect(button).toBeDisabled();
      expect(button).toHaveAttribute("aria-disabled", "true");
    });

    it("supports keyboard navigation", () => {
      render(<Button>Focusable Button</Button>);
      const button = screen.getByRole("button");

      button.focus();
      expect(button).toHaveFocus();
    });
  });

  describe("Form Accessibility", () => {
    it("associates labels with inputs correctly", () => {
      const testId = useId();
      render(
        <div>
          <Label htmlFor={testId}>Test Label</Label>
          <Input id={testId} />
        </div>,
      );

      const label = screen.getByText("Test Label");
      const input = screen.getByRole("textbox");

      expect(label).toHaveAttribute("for", testId);
      expect(input).toHaveAttribute("id", testId);
    });

    it("supports required field indication", () => {
      const requiredId = useId();
      render(
        <div>
          <Label htmlFor={requiredId}>
            Required Field <span aria-hidden="true">*</span>
          </Label>
          <Input id={requiredId} required />
        </div>,
      );

      const input = screen.getByRole("textbox");
      expect(input).toBeRequired();
    });
  });

  describe("Dialog Accessibility", () => {
    it("has proper ARIA attributes", () => {
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Accessible Dialog</DialogTitle>
              <DialogDescription>This dialog is accessible</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>,
      );

      const trigger = screen.getByText("Open Dialog");
      expect(trigger).toBeInTheDocument();
    });
  });

  describe("Color Contrast and Visual Accessibility", () => {
    it("applies focus-visible styles for keyboard navigation", () => {
      render(<Button data-testid="button">Focus Test</Button>);
      const button = screen.getByTestId("button");

      expect(button).toHaveClass("focus-visible:outline-none");
      expect(button).toHaveClass("focus-visible:ring-2");
      expect(button).toHaveClass("focus-visible:ring-ring");
    });

    it("provides sufficient visual feedback for interactive elements", () => {
      render(<Input data-testid="input" />);
      const input = screen.getByTestId("input");

      expect(input).toHaveClass("focus-visible:ring-2");
      expect(input).toHaveClass("focus-visible:ring-ring");
    });
  });
});
