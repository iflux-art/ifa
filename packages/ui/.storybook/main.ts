import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@chromatic-com/storybook"
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  docs: {
    defaultName: "Docs",
  },
  staticDirs: ["../public"],
};

export default config;