import { Routes, Route } from "react-router-dom";
import EventPage from "./dashboard/components/EventPage";
import App from "./App";

export const AppRouters = () => {
	return (
		<Routes>
			<Route path="/" element={<App />} />
			<Route path="/EventPage" element={<EventPage />} />
		</Routes>
	);
};
