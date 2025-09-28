import type { Meta, StoryObj } from "@storybook/react";
import { MDXPre } from "./mdx-pre";

const meta: Meta<typeof MDXPre> = {
  title: "Components/MDX/Pre",
  component: MDXPre,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    className: {
      control: "text",
      description: "自定义类名",
    },
  },
};

export default meta;
type Story = StoryObj<typeof MDXPre>;

export const JavaScriptCode: Story = {
  args: {
    children: (
      <pre className="language-js">
        <code className="language-js">{`function hello() {
  console.log("Hello, world!");
}`}</code>
      </pre>
    ),
  },
};

export const TypeScriptCode: Story = {
  args: {
    children: (
      <pre className="language-ts">
        <code className="language-ts">{`interface User {
  name: string;
  age: number;
}

const user: User = {
  name: "John",
  age: 30
};`}</code>
      </pre>
    ),
  },
};

export const PythonCode: Story = {
  args: {
    children: (
      <pre className="language-python">
        <code className="language-python">{`def hello():
    print("Hello, world!")

if __name__ == "__main__":
    hello()`}</code>
      </pre>
    ),
  },
};
