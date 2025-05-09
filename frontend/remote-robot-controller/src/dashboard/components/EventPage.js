import { Box, Stack } from "@mui/material";
import EventDataList from "./EventDataList";

function EventPage() {
	return (
		<Stack
			spacing={2}
			sx={{
				alignItems: "center",
				justify: "center",
				mx: 3,
				pb: 5,
				mt: { xs: 8, md: 0 },
			}}
		>
			<EventDataList />
		</Stack>
	);
}

export default EventPage;
