import React, { ChangeEvent } from "react";
import { useState } from "react";
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
			})
		}
	}

	function renderDialogueItem() {
		return dialogues.map(item => {
			return <div className="dialogue-item">
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
		})
	}
	return (
		<div className="app">
			<header>
				<h2>Chat Playground</h2>
			</header>
			<div className="container">
				<div className="dialogues" hidden={!dialogues.length}>

					{ renderDialogueItem() }
				</div>
				<div className="input-wrap">
					<input className="input-control" onKeyUp={handleKeyup} placeholder="请输入" />
					<img className="send" src="/send.png" alt="send" />
				</div>
			</div>

		</div>
	);
}

export default App;
