/**
 * Friends 功能模块统一导出
 */

// 组件导出
export { FriendLinkApplication } from "./friend-link-application";
export { FriendLinkCard } from "./friend-link-card";
// 工具函数导出
export {
  DEFAULT_FRIENDS_CONFIG,
  FRIEND_LINK_FORM_URL,
  FRIEND_LINK_REQUIREMENTS,
  hasFriendsData,
  processFriendsData,
} from "./lib";
// 类型导出
export type {
  FriendLink,
  FriendLinkFormConfig,
  FriendLinkRequirement,
  FriendsPageConfig,
  ProfileLink,
} from "./types";
