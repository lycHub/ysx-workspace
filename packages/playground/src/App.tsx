import React, { useRef } from "react";
import { useState } from "react";
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import "./App.scss";
import { Loading } from "./loading";
import { Empty } from "./empty";

interface Message {
	role: string;
	content: string;
}

interface DialogueItem {
	question: string;
	answers: Message[];
}

let loading = false;

function App() {
	const [dialogues, setDialogues] = useState<DialogueItem[]>([]);

	async function handleKeyup(event: KeyboardEvent) {
		if (loading) return;
		if (event.key.toLowerCase() === 'enter') {
			loading = true;
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
			try {
				const res = await request(value);
				const answers = res.choices.map((item: any) => item.message) as Message[];
				setDialogues(data => {
					const target = data.at(-1);
					if (target) {
						target.answers = answers;
					}
					return data.slice();
				});
			} catch (error) {
				console.log("chat error>>>", error);
			} finally {
				loading = false;
			}
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
								{
									item.answers.map(item => <p className="answer-item" key={item.content}>{item.content}</p>)
								}
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
				<TransitionGroup className="dialogues">
					<>
						{
							dialogues.length ? renderDialogueItem() : <Empty></Empty>
						}
					</>
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


function request(msg: string): Promise<any> {
	const myRequest = new Request('https://api.openai.com/v1/chat/completions', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': 'Bearer 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'
		},
		body: JSON.stringify({
			"model": "gpt-3.5-turbo",
			// n: 2,
			"messages": [{"role": "user", "content": msg}]
		})
	});
	return fetch(myRequest).then(response => response.json());
}