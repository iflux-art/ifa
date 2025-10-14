// Prism.js CSS 模块声明
declare module "prismjs/themes/prism-tomorrow.css" {
  const content: string;
  export default content;
}

declare module "prismjs/plugins/line-numbers/prism-line-numbers.css" {
  const content: string;
  export default content;
}

// 本地 CSS 模块声明
declare module "*.css" {
  const content: string;
  export default content;
}
