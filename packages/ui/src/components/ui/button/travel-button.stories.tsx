import type { Meta, StoryObj } from "@storybook/nextjs";
import { TravelButton } from "./travel-button";

const meta = {
  title: "UI/TravelButton",
  component: TravelButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TravelButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
