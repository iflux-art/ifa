"use client";

import mermaid from "mermaid";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({
  chart,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const renderDiagram = async () => {
      try {
        // 初始化 mermaid（如果尚未初始化）
        if (!mermaid.mermaidAPI) {
          mermaid.initialize({
            startOnLoad: false,
            theme: "default",
            securityLevel: "loose",
            fontFamily: "inherit",
          });
        }

        // 生成唯一 ID
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;

        // 渲染图表
        const { svg } = await mermaid.render(id, chart);
        setSvg(svg);
        setError(null);
      } catch (err) {
        console.error("Mermaid diagram rendering error:", err);
        setError(err instanceof Error ? err.message : "图表渲染失败");
        setSvg("");
      }
    };

    void renderDiagram();
  }, [chart]);

  if (error) {
    return (
      <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm">
        <p>图表渲染错误: {error}</p>
        <pre className="mt-2 p-2 bg-background/50 rounded text-xs overflow-x-auto">
          {chart}
        </pre>
      </div>
    );
  }

  if (!svg) {
    return (
      <div className="flex items-center justify-center p-8 bg-muted rounded-md">
        <div className="text-muted-foreground">图表渲染中...</div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn("flex justify-center my-6", className)}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: mermaid generates safe SVG content
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

export { MermaidDiagram };
