import React  from "react";

import "./App.scss";
import { NavLink, Outlet, useLocation, useOutlet } from "react-router-dom";
import { animated, useTransition } from "@react-spring/web";

function App() {
	const location = useLocation();
	const currentOutlet = useOutlet();
	const transitions = useTransition(location.pathname, {
		exitBeforeEnter: true,
		from: { opacity: 0 },
		enter: { opacity: 1 },
		leave: { opacity: 0 }
	});
	return <div id="app">
		<h2>App Here</h2>
		<nav>
			<NavLink to="">首页</NavLink> |
			<NavLink to="/chat">Chat</NavLink> |
			<NavLink to="/animate">Animate</NavLink> |
		</nav>
		{
			transitions((style, item, t, key)=> (
				<animated.div key={key} style={style}>{currentOutlet}</animated.div>
			))
		}
	</div>
}

export default App;