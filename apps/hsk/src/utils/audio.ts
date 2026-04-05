let zhVoiceCache: SpeechSynthesisVoice | null = null;

function getChineseVoice(): SpeechSynthesisVoice | null {
  if (zhVoiceCache) return zhVoiceCache;

  const voices = window.speechSynthesis.getVoices();
  zhVoiceCache = voices.find(
    (voice) =>
      voice.lang.includes("zh") ||
      voice.lang.includes("cmn") ||
      voice.lang === "zh-CN" ||
      voice.lang === "zh-TW"
  ) ?? null;

  return zhVoiceCache;
}

export const playAudio = (text: string) => {
  if (!window.speechSynthesis) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-CN";
  utterance.rate = 0.85;

  const zhVoice = getChineseVoice();
  if (zhVoice) {
    utterance.voice = zhVoice;
  }

  // On some browsers voices load asynchronously — retry with a slight delay
  if (!zhVoiceCache) {
    window.speechSynthesis.onvoiceschanged = () => {
      const voice = getChineseVoice();
      if (voice) utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
    };
  } else {
    window.speechSynthesis.speak(utterance);
  }
};
