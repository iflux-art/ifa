import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Loading } from "./loading";

// 模拟 useEffect 以便测试
vi.mock("react", async () => {
  const actual = await vi.importActual("react");
  return {
    ...actual,
    useEffect: (fn: () => void) => fn(),
  };
});

describe("Loading", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("should render without crashing", () => {
    render(<Loading />);
    // 检查是否渲染了容器元素
    const container = screen.getByRole("main", { hidden: true });
    expect(container).toBeInTheDocument();
  });

  it("should display progress bar", () => {
    render(<Loading />);
    // 检查是否渲染了进度条元素
    const progressBar = screen.getByLabelText("进度条");
    expect(progressBar).toBeInTheDocument();
  });
});
