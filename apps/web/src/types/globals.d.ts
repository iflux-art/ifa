// 全局CSS模块类型声明
declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

// 全局CSS文件类型声明
declare module "./globals.css" {
  const content: { [className: string]: string };
  export default content;
}
