// 移除Node.js模块导入，这些功能现在通过API路由提供
// import fs from "node:fs";
// import path from "node:path";
// import matter from "gray-matter";

// 移除接口定义，因为现在这些功能在服务器端实现
// interface ContentItem {
//   slug: string[];
// }

// /**
//  * 扫描内容目录
//  * 注意：这个函数现在应该通过API路由调用
//  */
// export function scanContentDirectory(options: {
//   contentDir: string;
//   indexFiles?: string[];
//   extensions?: string[];
//   excludePrefix?: string;
//   filter?: (itemPath: string) => boolean;
// }): ContentItem[] {
//   const {
//     contentDir,
//     indexFiles = ["index.mdx", "index.md"],
//     extensions = [".mdx", ".md"],
//     excludePrefix = "_",
//     filter = () => true,
//   } = options;

//   const paths: ContentItem[] = [];

//   function scan(dir: string, currentSlug: string[] = []) {
//     if (!fs.existsSync(dir)) return;
//     const items = fs.readdirSync(dir, { withFileTypes: true });
//     for (const item of items) {
//       if (item.name.startsWith(excludePrefix)) continue;

//       const itemPath = path.join(dir, item.name);
//       if (item.isDirectory()) {
//         scan(itemPath, [...currentSlug, item.name]);
//       } else if (item.isFile()) {
//         const ext = path.extname(item.name);
//         if (extensions.includes(ext)) {
//           const fileName = path.basename(item.name, ext);
//           if (indexFiles.includes(item.name)) {
//             paths.push({ slug: currentSlug });
//           } else if (filter(itemPath)) {
//             paths.push({ slug: [...currentSlug, fileName] });
//           }
//         }
//       }
//     }
//   }

//   scan(contentDir);
//   return paths;
// }

/**
 * 生成博客路径
 * 注意：这个函数现在应该通过API路由调用
 */
export function generateBlogPaths(): never {
  // 这个函数现在应该通过API路由获取数据
  // 在客户端使用时，需要通过API调用来获取数据
  throw new Error("This function should be called through API routes");

  // 保留原始实现作为参考（已注释）
  // return scanContentDirectory({
  //   contentDir: path.join(process.cwd(), "src", "content"),
  //   excludePrefix: "_",
  //   filter: (itemPath) => {
  //     const fileContent = fs.readFileSync(itemPath, "utf8");
  //     const { data } = matter(fileContent);
  //     return data.published !== false;
  //   },
  // });
}
