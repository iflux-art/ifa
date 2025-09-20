import type { Meta, StoryObj } from "@storybook/nextjs";
import { GitHubButton } from "./github-button";

const meta = {
  title: "UI/GitHubButton",
  component: GitHubButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    url: {
      control: "text",
      description: "GitHub 链接地址",
    },
  },
} satisfies Meta<typeof GitHubButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const CustomURL: Story = {
  args: {
    url: "https://github.com/vercel/next.js",
  },
};
