import React, { useId, useRef } from "react";
import { useState } from "react";
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import "./App.scss";
import { Loading } from "./loading";
import { Empty } from "./empty";
/* const mock = {
  "code": "ok",
  "msg": "\t以下是一个angular cli中配置postcss的示例：\r\n\r\n\t\t1.首先安装postcss和postcss-loader:\r\n\t\t```\r\n\t\tnpm install postcss postcss-loader --save-dev\r\n\t\t```\r\n\r\n\t\t2.在项目根目录下创建postcss.config.js文件，配置postcss插件和选项：\r\n\t\t```\r\n\t\tmodule.exports = {\r\n\t\t  plugins: [\r\n\t\t    require('autoprefixer'),\r\n\t\t    require('cssnano')({\r\n\t\t      preset: 'default',\r\n\t\t    }),\r\n\t\t  ],\r\n\t\t};\r\n\t\t```\r\n\r\n\t\t3.在angular.json文件中的build配置中添加postcss-loader：\r\n\t\t```\r\n\t\t\"build\": {\r\n\t\t  \"builder\": \"@angular-devkit/build-angular:browser\",\r\n\t\t  \"options\": {\r\n\t\t    ...\r\n\t\t    \"styles\": [\r\n\t\t      \"src/styles.css\"\r\n\t\t    ],\r\n\t\t    \"stylePreprocessorOptions\": {\r\n\t\t      \"includePaths\": [\r\n\t\t        \"src/styles\"\r\n\t\t      ]\r\n\t\t    },\r\n\t\t    \"postcss\": {\r\n\t\t      \"plugins\": [\r\n\t\t        require('autoprefixer'),\r\n\t\t        require('cssnano')({\r\n\t\t          preset: 'default',\r\n\t\t        }),\r\n\t\t      ]\r\n\t\t    },\r\n\t\t    ...\r\n\t\t  },\r\n\t\t  \"configurations\": {\r\n\t\t    ...\r\n\t\t  }\r\n\t\t}\r\n\t\t```\r\n\r\n\t\t4.重新启动应用程序，postcss将在构建期间自动应用于CSS文件。<|im_end|>"
}
 */
interface MsgElement {
	type: string;
	value: string[];
}

interface DialogueItem {
	question: string;
	elements: MsgElement[];
}

let loading = false;

function App() {
	const [dialogues, setDialogues] = useState<DialogueItem[]>([]);
	const replaceTime = useRef(0);
	async function handleKeyup(event: KeyboardEvent) {
		if (loading) return;
		if (event.key.toLowerCase() === 'enter') {
			loading = true;
			replaceTime.current = 0;
			const value = (event.target as HTMLInputElement).value;
			
		
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
						<p className="paragraph">{item.question}</p>
					</div>
					<div className="robot">
						<img className="ava" src="/gpt.png" alt="gpt" />
						{
							item.elements.length ? <div className="paragraph">
								{
									item.elements.map((item, index) => {
										if (item.type === 'code') {
											return <pre className="language-markup" key={index}>
												<code className="language-markup">
													{
														item.value.map(vItem => <p className="token tag">{vItem}</p>)
													}
												</code>
											</pre>
										}
										return <>
											{
												item.value.map(vItem => <p className="token tag">{vItem}</p>)
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

let pushCoding = false;
function formatElements(list: string[]) {
	let result: MsgElement[] = [];
	list.forEach(item => {
		if (item === '```') {
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