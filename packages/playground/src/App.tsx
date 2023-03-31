import React  from "react";

import "./App.scss";
import { NavLink, Outlet } from "react-router-dom";

function App() {

	return <div id="app">
		<h2>App Here</h2>
		<nav>
			<NavLink to="">首页</NavLink> |
			<NavLink to="chat">Chat</NavLink>
		</nav>
		<Outlet />
	</div>
}

export default App;