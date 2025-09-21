import type { Meta, StoryObj } from "@storybook/react";
import { GridLayout } from "./grid-layout";

const meta = {
  title: "Components/UI/Layout/GridLayout",
  component: GridLayout,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    layoutType: {
      control: "radio",
      options: ["full-width", "narrow", "three-column", "two-column"],
      description: "布局类型",
    },
  },
  args: {
    layoutType: "full-width",
  },
} satisfies Meta<typeof GridLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FullWidth: Story = {
  args: {
    children: (
      <div className="p-4 bg-blue-100 border border-blue-300 rounded">
        <h2 className="text-xl font-bold mb-2">主内容区域</h2>
        <p>这是宽布局的内容，占满12列。</p>
      </div>
    ),
    layoutType: "full-width",
  },
};

export const Narrow: Story = {
  args: {
    children: (
      <div className="p-4 bg-green-100 border border-green-300 rounded">
        <h2 className="text-xl font-bold mb-2">主内容区域</h2>
        <p>这是窄布局的内容，居中显示在8列中。</p>
      </div>
    ),
    layoutType: "narrow",
  },
};

export const ThreeColumn: Story = {
  args: {
    children: (
      <div className="p-4 bg-purple-100 border border-purple-300 rounded">
        <h2 className="text-xl font-bold mb-2">主内容区域</h2>
        <p>这是三栏布局的主内容区域，占8列。</p>
      </div>
    ),
    sidebars: [
      {
        id: "left-sidebar",
        position: "left",
        content: (
          <div className="p-4 bg-yellow-100 border border-yellow-300 rounded">
            <h3 className="font-bold mb-2">左侧边栏</h3>
            <p>左侧边栏内容</p>
          </div>
        ),
      },
      {
        id: "right-sidebar",
        position: "right",
        content: (
          <div className="p-4 bg-orange-100 border border-orange-300 rounded">
            <h3 className="font-bold mb-2">右侧边栏</h3>
            <p>右侧边栏内容</p>
          </div>
        ),
      },
    ],
    layoutType: "three-column",
  },
};

export const TwoColumn: Story = {
  args: {
    children: (
      <div className="p-4 bg-red-100 border border-red-300 rounded">
        <h2 className="text-xl font-bold mb-2">主内容区域</h2>
        <p>这是双栏布局的主内容区域，占10列。</p>
      </div>
    ),
    sidebars: [
      {
        id: "left-sidebar",
        position: "left",
        content: (
          <div className="p-4 bg-teal-100 border border-teal-300 rounded">
            <h3 className="font-bold mb-2">左侧边栏</h3>
            <p>左侧边栏内容</p>
          </div>
        ),
      },
    ],
    layoutType: "two-column",
  },
};
