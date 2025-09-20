import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { UserButton } from "./user-button";

const meta = {
  title: "Components/UI/Button/UserButton",
  component: UserButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    isSignedIn: {
      control: "boolean",
      description: "用户登录状态",
    },
  },
  args: {
    onSignOut: fn(),
    onSignIn: fn(),
  },
} satisfies Meta<typeof UserButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isSignedIn: false,
  },
};

export const SignedIn: Story = {
  args: {
    isSignedIn: true,
  },
};
