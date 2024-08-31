import { Outlet } from "react-router-dom";
import { PopularTopics } from "./components/PopularTopics";
import { TopDiscussions } from "./components/TopDiscussions";

export const ForumLayout = () => {
	return (
		<div>
			<div className={`discussion mt-14`}>
				<div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] gap-4">
					<PopularTopics />
					<Outlet></Outlet>
					<TopDiscussions />
				</div>
			</div>
		</div>
	);
};
