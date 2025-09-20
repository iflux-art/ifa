import type { Meta, StoryObj } from "@storybook/nextjs";
import { SearchButton } from "./search-button";

const meta = {
  title: "UI/SearchButton",
  component: SearchButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SearchButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
