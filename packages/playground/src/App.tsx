import React, { useId, useRef } from "react";
import { useState } from "react";
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import "./App.scss";
import { Loading } from "./loading";
import { Empty } from "./empty";

interface DialogueItem {
	question: string;
	answers: string[];
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
				if (res.code !== 'ok') {
					throw 'question error';
				}

				const answers = formatRes(res.msg);
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

	const id = useId();
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
						<p className="paragraph">{item.question}</p>
					</div>
					<div className="robot">
						<img className="ava" src="/gpt.png" alt="gpt" />

						{
							item.answers.length ? <div className="paragraph">
								{
									item.answers.map(item => <p className="answer-item" key={`${id}_${item}`}>{item}</p>)
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
					<input className="input-control" autoComplete="none" onKeyUp={handleKeyup} placeholder="请输入" />
					<img className="send" src="/send.png" alt="send" />
				</div>
			</div>

		</div>
	);
}

export default App;


function request(msg: string): Promise<{
	code: string;
	msg: string;
}> {
	const fd = new FormData();

	fd.append('question', `<|im_start|>system
		你是基于ChatGPT模型开发的智能聊天机器人。
		<|im_end|>
		<|im_start|>user
		${msg}
		<|im_end|>
	`);
	fd.append('temperature', '0.6');
	const myRequest = new Request('/chatgptapi/azure/answer', {
		method: 'POST',
		body: fd
	});
	return fetch(myRequest).then(response => response.json());
}


function formatRes(msg: string) {
	return msg.replaceAll(/\t/g, '')
		.replace('<|im_end|>', '')
		.split('\r\n').filter(Boolean);
}