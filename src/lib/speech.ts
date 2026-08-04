// Web Speech API 封装 - 英语发音朗读
let cachedVoice: SpeechSynthesisVoice | null = null;
let voiceReady = false;

function pickEnglishVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  // 优先选英式/美式英语女声
  const preferred =
    voices.find((v) => /en[-_]?US/i.test(v.lang) && v.name.includes("Female")) ||
    voices.find((v) => /en[-_]?GB/i.test(v.lang) && v.name.includes("Female")) ||
    voices.find((v) => /en[-_]?US/i.test(v.lang)) ||
    voices.find((v) => /en[-_]?GB/i.test(v.lang)) ||
    voices.find((v) => /^en/i.test(v.lang)) ||
    voices[0];
  return preferred || null;
}

export function initSpeech() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  if (voiceReady) return;
  const load = () => {
    cachedVoice = pickEnglishVoice();
    voiceReady = true;
  };
  load();
  window.speechSynthesis.onvoiceschanged = load;
}

export function speak(text: string, rate = 0.85) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  try {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    utter.rate = rate;
    utter.pitch = 1;
    if (cachedVoice) utter.voice = cachedVoice;
    window.speechSynthesis.speak(utter);
  } catch {
    // 静默失败
  }
}

export function stopSpeak() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
}
