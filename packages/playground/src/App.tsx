import React, { useRef } from "react";
import { useState } from "react";
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import "./App.scss";
import { Loading } from "./loading";

interface Message {
	role: string;
	message: string;
}

interface DialogueItem {
	question: string;
	answers: Message[];
}

const loading = false;

function App() {
	const [dialogues, setDialogues] = useState<DialogueItem[]>([]);

	function handleKeyup(event: KeyboardEvent) {
		if (event.key.toLowerCase() === 'enter') {
			// loading
			const value = (event.target as HTMLInputElement).value;
			setDialogues(data => {
				return [
					...data,
					{
						question: value,
						answers: []
					}
				]
			});
		}
	}

	const nodeRef = useRef(null);

	function renderDialogueItem() {
		return dialogues.map((item, index) => {
			return <CSSTransition
				key={`${item.question}_${index}`}
				in={!!item}
				nodeRef={nodeRef}
				timeout={300}
				classNames="alert"
			>
				<div className="dialogue-item" ref={nodeRef}>
					<div className="user">
						<img className="ava" src="/ysx.webp" alt="ysx" />
						<p className="paragraph">{ item.question }</p>
					</div>
					<div className="robot">
						<img className="ava" src="/gpt.png" alt="gpt" />

						{
							item.answers.length ? <div className="paragraph">
								<p className="answer-item">answer-item</p>
								<p className="answer-item">answer-item</p>
								<p className="answer-item">answer-item</p>
							</div> : <Loading></Loading>
						}

					</div>
				</div>
			</CSSTransition>

		})
	}
	return (
		<div className="app">
			<header>
				<h2>Chat Playground</h2>
			</header>
			<div className="container">
				<TransitionGroup className="dialogues" hidden={!dialogues.length}>
					{ renderDialogueItem() }
				</TransitionGroup>
				<div className="input-wrap">
					{/* @ts-ignore */}
					<input className="input-control" onKeyUp={handleKeyup} placeholder="请输入" />
					<img className="send" src="/send.png" alt="send" />
				</div>
			</div>

		</div>
	);
}

export default App;
