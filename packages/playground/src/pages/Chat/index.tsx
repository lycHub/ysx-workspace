import React, { ChangeEvent, useEffect, useId, useRef } from "react";
import { useState } from "react";
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import "./index.scss";
import { Loading } from "../../loading";
import { Empty } from "../../empty";
import { useSpeech } from "../../hooks/useSpeech";
import { useSpeechRecognize } from "../../hooks/useSpeechRecognize";
import ReactRouterPrompt from "../../hooks/prompt";

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
    <img src="/horn.png" alt="语音" />
  </button>
}

function Microphone({ listening, onClick }: { listening: boolean; onClick: () => void; }) {
  return 	<button className="microphone-btn" onClick={onClick}>
    <img src={ listening ? '/mirrophone-stop.png' : '/mirrophone.png' } alt="语音" />
  </button>
}

function Chat() {
  const [dialogues, setDialogues] = useState<DialogueItem[]>([]);
  const anchorRef = useRef<HTMLElement>(null);

  useEffect(() => {
    anchorRef.current?.scrollIntoView(true);
  }, [dialogues]);

  const [inputValue, setInputValue] = useState('');

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    setInputValue(event.target.value);
  }

  function handleKeyup(event: KeyboardEvent) {
    if (loading) return;
    if (event.key.toLowerCase() === 'enter') {
      send();
    }
  }

  async function send() {
    if (!inputValue) return;
    loading = true;

    /*const answers = formatRes(mock.msg);
    const elements = formatElements(answers);*/

    setDialogues(data => {
      return [
        ...data,
        {
          question: inputValue,
          elements: []
        }
      ]
    });
    setInputValue('');

    try {
      const res = await request(inputValue);
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

  const { synth, utterance, lang } = useSpeech();



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

  const { toggle, result, isListening } = useSpeechRecognize(() => {
    console.log("end>>>");
    setInputValue(result.current);
  });

  function handleMicroPhone() {
    toggle();
  }

  return (
    <div className="chat">
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
            <span ref={anchorRef} style={{ visibility: 'hidden' }}>Anchor</span>
          </>
        </TransitionGroup>
        <div className="actions">
          <div className="input-wrap">
            {/* @ts-ignore */}
            <input className="input-control" autoComplete="none" value={inputValue} onChange={handleInputChange} onKeyUp={handleKeyup} placeholder="请输入" />
            <img className="send" onClick={send} src="/send.png" alt="send" />

          </div>
          <Microphone listening={isListening} onClick={handleMicroPhone} />
        </div>

      </div>

      <ReactRouterPrompt when={!!inputValue.length}>
        {({ isActive, onConfirm, onCancel }) =>
          isActive && (
            <div className="lightbox">
              <div className="container">
                <p>Do you really want to leave?</p>
                <button type="button" onClick={onCancel}>
                  Cancel
                </button>
                <button type="submit" onClick={onConfirm}>
                  Ok
                </button>
              </div>
            </div>
          )
        }
      </ReactRouterPrompt>
    </div>
  );
}

export default Chat;


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