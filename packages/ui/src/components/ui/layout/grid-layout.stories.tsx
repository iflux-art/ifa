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
      options: [
        "full-width",
        "centered",
        "three-column",
        "sidebar-left",
        "sidebar-right",
        "asymmetric",
        "full-screen",
      ],
      description: "布局类型，支持2025年主流设备尺寸的响应式设计",
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
        <p>
          这是全宽布局的内容，占满12列。响应式断点设计符合2025年主流设备尺寸。
        </p>
      </div>
    ),
    layoutType: "full-width",
  },
};

export const Centered: Story = {
  args: {
    children: (
      <div className="p-4 bg-green-100 border border-green-300 rounded">
        <h2 className="text-xl font-bold mb-2">主内容区域</h2>
        <p>
          这是居中布局的内容，居中显示在8列中。响应式断点设计符合2025年主流设备尺寸。
        </p>
      </div>
    ),
    layoutType: "centered",
  },
};

export const ThreeColumn: Story = {
  args: {
    children: (
      <div className="p-4 bg-purple-100 border border-purple-300 rounded">
        <h2 className="text-xl font-bold mb-2">主内容区域</h2>
        <p>
          这是三栏布局的主内容区域，占8列。响应式断点设计符合2025年主流设备尺寸。
        </p>
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

export const SidebarLeft: Story = {
  args: {
    children: (
      <div className="p-4 bg-red-100 border border-red-300 rounded">
        <h2 className="text-xl font-bold mb-2">主内容区域</h2>
        <p>
          这是左侧边栏布局的主内容区域，占10列。响应式断点设计符合2025年主流设备尺寸。
        </p>
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
    layoutType: "sidebar-left",
  },
};

export const SidebarRight: Story = {
  args: {
    children: (
      <div className="p-4 bg-indigo-100 border border-indigo-300 rounded">
        <h2 className="text-xl font-bold mb-2">主内容区域</h2>
        <p>
          这是右侧边栏布局的主内容区域，占10列。响应式断点设计符合2025年主流设备尺寸。
        </p>
      </div>
    ),
    sidebars: [
      {
        id: "right-sidebar",
        position: "right",
        content: (
          <div className="p-4 bg-pink-100 border border-pink-300 rounded">
            <h3 className="font-bold mb-2">右侧边栏</h3>
            <p>右侧边栏内容</p>
          </div>
        ),
      },
    ],
    layoutType: "sidebar-right",
  },
};

export const Asymmetric: Story = {
  args: {
    children: (
      <div className="p-4 bg-cyan-100 border border-cyan-300 rounded">
        <h2 className="text-xl font-bold mb-2">主内容区域</h2>
        <p>
          这是不对称布局的主内容区域，占6列，创造视觉层次。响应式断点设计符合2025年主流设备尺寸。
        </p>
      </div>
    ),
    sidebars: [
      {
        id: "left-sidebar",
        position: "left",
        content: (
          <div className="p-4 bg-amber-100 border border-amber-300 rounded">
            <h3 className="font-bold mb-2">左侧边栏</h3>
            <p>左侧边栏内容</p>
          </div>
        ),
      },
      {
        id: "right-sidebar",
        position: "right",
        content: (
          <div className="p-4 bg-lime-100 border border-lime-300 rounded">
            <h3 className="font-bold mb-2">右侧边栏</h3>
            <p>右侧边栏内容</p>
          </div>
        ),
      },
    ],
    layoutType: "asymmetric",
  },
};

export const FullScreen: Story = {
  args: {
    children: (
      <div className="p-4 bg-violet-100 border border-violet-300 rounded flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">主内容区域</h2>
          <p>
            这是全屏布局的内容，占满整个视口。响应式断点设计符合2025年主流设备尺寸。
          </p>
        </div>
      </div>
    ),
    layoutType: "full-screen",
  },
};
