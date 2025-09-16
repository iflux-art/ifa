import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./input";
import { Label } from "./label";
import { useId } from "react";

const meta = {
  title: "Components/Label",
  component: Label,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Label",
  },
};

export const WithInput: Story = {
  render: () => {
    const emailId = useId();
    return (
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor={emailId}>Email</Label>
        <Input type="email" id={emailId} placeholder="Email" />
      </div>
    );
  },
};

export const Required: Story = {
  render: () => {
    const nameId = useId();
    return (
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor={nameId}>
          Name <span className="text-red-500">*</span>
        </Label>
        <Input id={nameId} placeholder="Enter your name" />
      </div>
    );
  },
};

export const WithHelperText: Story = {
  render: () => {
    const passwordId = useId();
    return (
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor={passwordId}>Password</Label>
        <Input type="password" id={passwordId} placeholder="Password" />
        <p className="text-sm text-muted-foreground">
          Must be at least 8 characters long.
        </p>
      </div>
    );
  },
};

export const FormExample: Story = {
  render: () => {
    const firstNameId = useId();
    const lastNameId = useId();
    const emailFormId = useId();
    const messageId = useId();

    return (
      <form className="space-y-4 w-full max-w-sm">
        <div className="grid items-center gap-1.5">
          <Label htmlFor={firstNameId}>First Name</Label>
          <Input id={firstNameId} placeholder="John" />
        </div>
        <div className="grid items-center gap-1.5">
          <Label htmlFor={lastNameId}>Last Name</Label>
          <Input id={lastNameId} placeholder="Doe" />
        </div>
        <div className="grid items-center gap-1.5">
          <Label htmlFor={emailFormId}>Email</Label>
          <Input type="email" id={emailFormId} placeholder="john@example.com" />
        </div>
        <div className="grid items-center gap-1.5">
          <Label htmlFor={messageId}>Message</Label>
          <textarea
            id={messageId}
            placeholder="Your message..."
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </form>
    );
  },
};
