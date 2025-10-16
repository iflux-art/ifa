import dynamic from "next/dynamic";
import friendsData from "@/components/features/friends/friends.json";

// 动态导入友链页面组件
const FriendsPage = dynamic(
  () => import("@/components/layout/friends-page").then((mod) => mod.FriendsPage),
  {
    ssr: true,
  }
);

const FriendsPageWrapper = () => {
  return <FriendsPage friendsData={friendsData} />;
};

export default FriendsPageWrapper;
