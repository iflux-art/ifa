import type { Meta, StoryObj } from "@storybook/react";
import { MDXCode } from "./mdx-code";

const meta: Meta<typeof MDXCode> = {
  title: "Components/MDX/Code",
  component: MDXCode,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    inline: {
      control: "boolean",
      description: "是否为内联代码",
    },
    className: {
      control: "text",
      description: "自定义类名",
    },
  },
};

export default meta;
type Story = StoryObj<typeof MDXCode>;

export const InlineCode: Story = {
  args: {
    inline: true,
    children: "const example = 'inline code';",
  },
};

export const BlockCode: Story = {
  args: {
    inline: false,
    children: "const example = 'block code';",
  },
};
