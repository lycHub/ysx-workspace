import React  from "react";

import "./App.scss";
import { NavLink, useOutlet } from "react-router-dom";

function App() {
	const currentOutlet = useOutlet();
	return <div id="app">
		<h2>App Here</h2>
		<nav>
			<NavLink to="">首页</NavLink> |
			<NavLink to="/chat">Chat</NavLink> |
			<NavLink to="/animate">Animate</NavLink> |
			<NavLink to="/grid">Grid Notes</NavLink> |
		</nav>
		{currentOutlet}
	</div>
}

export default App;