import friendsData from "@/components/features/friends/friends.json";
import { FriendsPage } from "@/components/layout/friends-page";

const FriendsPageWrapper = () => {
	return <FriendsPage friendsData={friendsData} />;
};

export default FriendsPageWrapper;
