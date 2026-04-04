export const playAudio = (text: string) => {
  if (!window.speechSynthesis) return;
  
  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-CN';
  utterance.rate = 0.85; // Slightly slower for better learning
  
  // Try to find a good Chinese voice
  const voices = window.speechSynthesis.getVoices();
  const zhVoice = voices.find(voice => voice.lang.includes('zh') || voice.lang.includes('cmn'));
  if (zhVoice) {
    utterance.voice = zhVoice;
  }

  window.speechSynthesis.speak(utterance);
};
