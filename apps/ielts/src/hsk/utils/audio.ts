export const playAudio = (text: string) => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-CN';
  utterance.rate = 0.85;

  const voices = window.speechSynthesis.getVoices();
  const zhVoice = voices.find(voice => voice.lang.includes('zh') || voice.lang.includes('cmn'));
  if (zhVoice) {
    utterance.voice = zhVoice;
  }

  window.speechSynthesis.speak(utterance);
};
