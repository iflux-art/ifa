/**
 * 示例文件：演示如何使用 @/content 路径别名简化内容导入
 *
 * 通过使用路径别名，我们可以简化对 content 目录中文件的导入：
 *
 * 之前可能需要这样导入：
 * import linkData from '../../../content/links/tools.json';
 *
 * 现在可以这样导入：
 * import linkData from '@/content/links/tools.json';
 *
 * 这样做的好处：
 * 1. 路径更简洁易读
 * 2. 不受文件层级深度影响
 * 3. 重构时更稳定
 * 4. 更容易维护
 */

// 示例：使用路径别名导入内容文件
// import aiTools from '@/content/ai/tools.json';
// import devTools from '@/content/development/tools.json';

export function getLinksContentImportExample() {
  return "This is an example of how to use the @/content path alias for simplified imports";
}
