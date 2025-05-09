import * as React from "react";

import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MainGrid from "./components/MainGrid";

export default function Dashboard(props) {
	// ヘッダー部分のコンポーネント
	const Header = () => (
		<AppBar position="static" color="primary" elevation={2} sx={{ display: { xs: 'none', sm: 'block' } }}>
			<Toolbar >
				<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
					これはヘッダーです
				</Typography>
				<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
					これはヘッダーです
				</Typography>
				<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
					これはヘッダーです
				</Typography>
			</Toolbar>
		</AppBar>
	);

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
					<Header />
					<MainGrid />
				</Stack>
			</Box>
		</Box>
	);
}
