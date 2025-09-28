import type { Meta, StoryObj } from "@storybook/react";
import { CodeBlock } from "./code-block";

const meta: Meta<typeof CodeBlock> = {
  title: "Components/MDX/CodeBlock",
  component: CodeBlock,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    code: {
      control: "text",
      description: "代码内容",
    },
    language: {
      control: "text",
      description: "编程语言",
    },
    fileName: {
      control: "text",
      description: "文件名",
    },
    showLineNumbers: {
      control: "boolean",
      description: "是否显示行号",
    },
    className: {
      control: "text",
      description: "自定义类名",
    },
  },
};

export default meta;
type Story = StoryObj<typeof CodeBlock>;

export const JavaScript: Story = {
  args: {
    code: `function hello() {
  console.log("Hello, world!");
}`,
    language: "javascript",
  },
};

export const TypeScript: Story = {
  args: {
    code: `interface User {
  name: string;
  age: number;
}

const user: User = {
  name: "John",
  age: 30
};`,
    language: "typescript",
    fileName: "user.ts",
  },
};

export const Python: Story = {
  args: {
    code: `def hello():
    print("Hello, world!")

if __name__ == "__main__":
    hello()`,
    language: "python",
    showLineNumbers: true,
  },
};

export const JsonExample: Story = {
  args: {
    code: `{
  "name": "John",
  "age": 30,
  "city": "New York"
}`,
    language: "json",
    fileName: "data.json",
    showLineNumbers: true,
  },
};
