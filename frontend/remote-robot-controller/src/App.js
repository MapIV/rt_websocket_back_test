import logo from "./logo.svg";
import "./App.css";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import Dashboard from "./dashboard/Dashboard";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

function App() {
	return (
		<div className="App">
			<link
				rel="stylesheet"
				href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
			/>
			<Dashboard />
		</div>
	);
}

export default App;
