import { useEffect, useMemo, useRef, useState } from "react";
import { SpeechRecognition, SpeechRecognitionErrorEvent } from "./type";

const SpeechRecognition = window && ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)


export function useSpeechRecognize(endCallback: () => void) {
  const [isListening, setIsListening] = useState(false);
  const isFinal = useRef(false);
  const result = useRef('');
  const error = useRef<SpeechRecognitionErrorEvent>();

  const recognition = useRef<SpeechRecognition>(); // 组件刷新时保证引用不变

  useEffect(() => {
    if (SpeechRecognition) {
      recognition.current = new SpeechRecognition() as SpeechRecognition;
      recognition.current.continuous = true;
      recognition.current.interimResults = true;
      recognition.current.lang = 'zh-CN';

      if (recognition.current) {
        recognition.current.addEventListener('start', (event) => {
          isFinal.current = false;
        });

        recognition.current.addEventListener('error', (event) => {
          console.error("recognition error>>>", event);
          setIsListening(false);
          error.current = event;
        });


        recognition.current.addEventListener('end', () => {
          console.log("recognition end");
          setIsListening(false);
          if (endCallback) {
            endCallback();
          }
        });

        recognition.current.addEventListener('result', (event) => {
          result.current = Array.from(event.results)
            .map((result) => {
              isFinal.current = result.isFinal;
              return result[0];
            })
            .map(result => result.transcript)
            .join('');
          error.current = undefined;
        });
      }
    }
    return () => {
      recognition.current?.stop();
    }
  }, []);




  const toggle = () => {
    const listening = !isListening;
    setIsListening(listening);
    if (listening) {
      recognition.current?.start();
    } else {
      recognition.current?.stop();
    }
  }

  return {
    // isSupported,
    isListening,
    isFinal,
    recognition,
    result,
    error,

    toggle,
  }
}