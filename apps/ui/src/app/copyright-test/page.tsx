"use client";

import { COPYRIGHT_TEXT, Footer } from "@iflux-art/ui";
import { useState } from "react";

export default function CopyrightTestPage() {
  const [customText, setCustomText] = useState("");
  const [displayText, setDisplayText] = useState(COPYRIGHT_TEXT);

  const handleUpdate = () => {
    if (customText.trim()) {
      setDisplayText(customText);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">版权文本测试</h1>
        <p className="text-lg text-muted-foreground">
          测试 @iflux-art/ui 包中的 COPYRIGHT_TEXT 常量
        </p>
      </div>

      <div className="mb-12 bg-card rounded-lg border p-6">
        <h2 className="text-2xl font-semibold mb-4">默认版权文本</h2>
        <div className="mb-6 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">{COPYRIGHT_TEXT}</p>
        </div>

        <h2 className="text-2xl font-semibold mb-4">自定义版权文本</h2>
        <div className="mb-6">
          <input
            type="text"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="输入自定义版权文本"
            className="w-full p-2 border rounded-md mb-4"
          />
          <button
            type="button"
            onClick={handleUpdate}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            更新版权文本
          </button>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Footer 组件显示</h2>
        <div className="mb-6 p-4 bg-muted rounded-lg">
          <Footer />
        </div>

        <h2 className="text-2xl font-semibold mb-4">自定义 Footer 组件</h2>
        <div className="mb-6 p-4 bg-muted rounded-lg">
          <footer className="w-full py-4 md:py-6 border-t border-border/30 bg-transparent">
            <div className="container mx-auto flex items-center justify-center px-4">
              <div className="text-sm text-muted-foreground">
                {displayText}
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}