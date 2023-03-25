import React, { useEffect, useId, useLayoutEffect, useRef } from "react";
import { useState } from "react";
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import "./App.scss";
import { Loading } from "./loading";
import { Empty } from "./empty";
 const mock = {
	 "code": "ok",
	 "msg": "\t您可以使用HTML5的Audio标签来实现JavaScript语音播放。例如：\r\n\r\n\t\t```javascript\r\n\t\tvar audio = new Audio('path/to/audiofile.mp3');\r\n\t\taudio.play();\r\n\t\t```\r\n\r\n\t\t其中，'path/to/audiofile.mp3'应该替换为您要播放的音频文件的实际路径。<|im_end|>"
 }

interface MsgElement {
	type: string;
	value: string[];
}

interface DialogueItem {
	question: string;
	elements: MsgElement[];
}

let loading = false;


function Horn({ onClick, hidden }: { hidden: boolean; onClick: () => void; }) {
	return 	<button className="horn-btn" hidden={hidden} onClick={onClick}>
		<img src="/laba.png" alt="语音" />
	</button>
}

function MicPhone() {
	return 	<button>
		<img src="/micphone.png" alt="语音" />
	</button>
}

function App() {
	const [dialogues, setDialogues] = useState<DialogueItem[]>([]);
	const replaceTime = useRef(0);
	const dialoguesRef = useRef<HTMLDivElement>(null);

	async function handleKeyup(event: KeyboardEvent) {
		if (loading) return;
		if (event.key.toLowerCase() === 'enter') {
			loading = true;
			replaceTime.current = 0;
			const target = event.target as HTMLInputElement;
			const value = (event.target as HTMLInputElement).value;

			/*const answers = formatRes(mock.msg);
			const elements = formatElements(answers);*/
		
			setDialogues(data => {
				return [
					...data,
					{
						question: value,
						elements: []
					}
				]
			});

			try {
				const res = await request(value);
				if (res.code !== 'ok') {
					throw 'question error';
				}
				const answers = formatRes(res.msg);
				const elements = formatElements(answers);

				setDialogues(data => {
					const target = data.at(-1);
					if (target) {
						target.elements = elements;
					}
					return data.slice();
				});
				target.value = '';
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
				key={`${item.question}_${index}-${id}`}
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
							item.elements.length ? <div className="paragraph">
								{
									item.elements.map((answerItem, answerIndex) => {
										const isLast = item.elements[answerIndex + 1];
										if (answerItem.type === 'code') {
											return <>
												<pre className="language-markup" key={id + '-' + answerIndex}>
													<code className="language-markup">
														{
															answerItem.value.map((vItem, vIndex) => <p className="p-row token tag" key={id + '-' + vIndex}>
																{vItem}
															</p>)
														}
													</code>
												</pre>
												<Horn hidden={!!isLast} onClick={() => { handlePlay(index) }} />
											</>
										}
										return <>
											{
												answerItem.value.map(vItem => <p className="p-row" key={id + '-' + answerIndex}>
													{vItem} <Horn hidden={!!isLast} onClick={() => { handlePlay(index) }} />
												</p>)
											}
										</>
									})
								}
							</div> : <Loading></Loading>
						}

					</div>
				</div>
			</CSSTransition>

		})
	}


	const synth = window.speechSynthesis;
	let lang = useRef<SpeechSynthesisVoice>();
	let utterance: SpeechSynthesisUtterance;
	// synth.cancel();

	if (speechSynthesis) {
		utterance = new SpeechSynthesisUtterance();
		// utterance.rate  = 1;
		utterance.onerror = function (event) {
			console.error("SpeechSynthesisUtterance.onerror", event);
		};
		synth.addEventListener("voiceschanged", (event) => {
			const voices = synth.getVoices().filter(item => item.localService);
			// console.log("voices", voices);
			if (voices.length) {
				lang.current = voices.find(item => item.default)!;
			}
		});
		utterance.addEventListener("end", (event) => {
			console.log("utterance end");
		});
	}



	function handlePlay(secIndex: number) {
		if (!utterance || !lang.current) return;
		// console.log("dialogues", dialogues, secIndex);
		const textEls = dialogues[secIndex].elements.filter(item => item.type === 'text');
		if (textEls.length) {
			const msgs = textEls.reduce((prev, curr) => {
				return prev += curr.value.join('');
			}, '');
			// console.log("msgs", msgs);
			if (msgs) {
				synth.cancel();
				utterance.text = msgs;
				synth.speak(utterance);
			}
		}
	}
	return (
		<div className="app">
			<header>
				<h2>Chat Playground</h2>
				{/*<button onClick={() => { handlePlay(0) }}>播放</button>*/}
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

let pushCoding = false;
function formatElements(list: string[]) {
	let result: MsgElement[] = [];
	list.forEach(item => {
		if (item.includes('```')) {
			pushCoding = !pushCoding;
			if (pushCoding) {
				result.push({
					type: 'code',
					value: []
				});
			}
		} else {
			if (pushCoding) {
				const target = result.at(-1);
				if (target?.type === 'code') {
					target.value.push(item);
				}
			} else {
				result.push({
					type: 'text',
					value: [item]
				});
			}
		}
		
	});
	return result;
}