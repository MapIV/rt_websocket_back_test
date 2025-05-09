import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";


const EventPageButton = () => {

	const navigate = useNavigate();
	const HandleEvent = () => {
		navigate("/EventPage");
	};


	return (
		<Box sx={{ "& button": { m: 1 } }}>
				<Button variant="outlined" onClick={HandleEvent} size="small">
					Event
				</Button>
		</Box>
	);
}

export default EventPageButton