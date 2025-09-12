import type { Metadata } from "next";
import { LinkCard } from "@/components/ui/link-card";
import { DocPageLayout } from "@/features/docs/components";
import { DocsSidebarCard } from "@/features/docs/components";
import { ThreeColumnLayout } from "@/features/layout";
import { getAllDocsStructure } from "@/features/docs/components";

/**
 * 首页元数据配置
 */
const HOME_PAGE_METADATA: Metadata = {
  title: "斐流艺创",
  description: "斐流艺创项目文档和使用指南",
  openGraph: {
    title: "斐流艺创",
    description: "斐流艺创项目文档和使用指南",
    type: "website",
  },
};

/**
 * 生成首页元数据
 */
export function generateMetadata(): Metadata {
  return HOME_PAGE_METADATA;
}

export default function HomePage() {
  // 获取文档结构数据
  const structure = getAllDocsStructure();

  // 过滤掉index页面，只保留分类
  const categories = structure.categories;

  // 左侧边栏内容 - 文档导航
  const leftSidebar = <DocsSidebarCard showHeader={false} />;

  return (
    <DocPageLayout>
      <ThreeColumnLayout leftSidebar={leftSidebar}>
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map(category => (
              <LinkCard
                key={category.id}
                title={category.title}
                description={category.description}
                href={`/${category.id}`}
                isExternal={false}
              />
            ))}
          </div>
        </div>
      </ThreeColumnLayout>
    </DocPageLayout>
  );
}
