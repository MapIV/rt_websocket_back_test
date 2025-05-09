import * as React from "react";

import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import MainGrid from "./components/MainGrid";




export default function Dashboard(props) {
	return (
		<Box sx={{ display: "flex" }}>
			<Box
				component="main"
				sx={(theme) => ({
					flexGrow: 1,
					backgroundColor: theme.vars
						? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
						: alpha(theme.palette.background.default, 1),
					overflow: "auto",
				})}
			>
				<Stack
					spacing={2}
					sx={{
						alignItems: "center",
					}}
				>
					{/* <Header /> */}
					<MainGrid />
				</Stack>
			</Box>
		</Box>
	);
}
