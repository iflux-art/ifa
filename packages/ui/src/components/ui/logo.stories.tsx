import type { Meta, StoryObj } from "@storybook/react";
import { Logo } from "./logo";

const meta = {
  title: "UI/Logo",
  component: Logo,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: "iFluxArt",
  },
};

export const CustomText: Story = {
  args: {
    text: "自定义Logo",
  },
};

export const WithCustomLink: Story = {
  args: {
    text: "iFluxArt",
    href: "/dashboard",
  },
};

export const ExternalLink: Story = {
  args: {
    text: "iFluxArt",
    href: "https://www.iflux.art/",
    isExternal: true,
  },
};

export const WithCustomClassName: Story = {
  args: {
    text: "iFluxArt",
    className: "text-red-500",
  },
};

export const WithCustomAriaLabel: Story = {
  args: {
    text: "iFluxArt",
    ariaLabel: "返回首页 - iFluxArt",
  },
};
