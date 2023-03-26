import { useRef } from "react";

export function useSpeech() {
  const synth = window.speechSynthesis;
  let lang = useRef<SpeechSynthesisVoice>();
  let utterance!: SpeechSynthesisUtterance;
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

  return {
    lang,
    synth,
    utterance
  }
}