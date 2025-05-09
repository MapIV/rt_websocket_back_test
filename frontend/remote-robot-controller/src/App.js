import "./App.css";
import Dashboard from "./dashboard/Dashboard";

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
