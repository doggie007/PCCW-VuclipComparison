// import * as React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Dashboard from "./components/dashboard/Dashboard";
import Button from "@mui/material/Button";
import "./App.css";

function App() {
	return (
		<Router>
			<div>
				<Dashboard></Dashboard>
			</div>
		</Router>
	);
}

export default App;
