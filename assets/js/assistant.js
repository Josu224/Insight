const voiceBtn = document.getElementById("voiceBtn");
const voiceStatus = document.getElementById("voiceStatus");
const homeLink = document.getElementById("homeLink");

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;
let tts = window.speechSynthesis;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.continuous = false; // better cross-browser support

  recognition.onstart = () => {
    voiceBtn.classList.add("recording");
    voiceStatus.textContent = "Listening...";
    speak("Listening, please describe what you hear, feel, taste, and smell");
  };

  recognition.onresult = (event) => {
    // Always take the first alternative of the last result
    const command =
      event.results[event.results.length - 1][0].transcript.trim();
    if (command) {
      voiceStatus.textContent = `You said: "${command}"`;
      speak(`You said: ${command}`);
    } else {
      voiceStatus.textContent = "Sorry, I couldn't hear you. Try again.";
      speak("Sorry, I couldn't hear you. Try again.");
    }
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);

    switch (event.error) {
      case "not-allowed":
        voiceStatus.textContent = "Microphone access denied";
        speak(
          "Microphone access denied. Please allow it in your browser settings."
        );
        break;
      case "network":
        voiceStatus.textContent = "Network error: speech service unavailable";
        speak(
          "Network error. Please check your internet connection and try again."
        );
        break;
      case "no-speech":
      case "aborted":
        voiceStatus.textContent = "I couldn't hear you. Try again.";
        speak("I couldn't hear you. Try again.");
        break;
      default:
        voiceStatus.textContent = "An error occurred. Try again.";
        speak("An error occurred. Try again.");
        break;
    }

    voiceBtn.classList.remove("recording");
  };

  recognition.onend = () => {
    voiceBtn.classList.remove("recording");
    voiceStatus.textContent = "Hold the blue button to speak";
  };
} else {
  voiceStatus.textContent = "Speech recognition not supported";
}

// --- Long press logic (blue button) ---
let pressTimer;
voiceBtn.addEventListener("mousedown", () => {
  pressTimer = setTimeout(() => recognition.start(), 300);
});
voiceBtn.addEventListener("mouseup", () => clearTimeout(pressTimer));
voiceBtn.addEventListener("mouseleave", () => clearTimeout(pressTimer));
voiceBtn.addEventListener("touchstart", () => {
  pressTimer = setTimeout(() => recognition.start(), 300);
});
voiceBtn.addEventListener("touchend", () => clearTimeout(pressTimer));

// --- TTS helper ---
function speak(text) {
  if (tts.speaking) tts.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "en-US";
  tts.speak(utter);
}

// --- Home link navigation ---
// Only add event listeners if homeLink exists
if (homeLink) {
  homeLink.addEventListener("click", () => {
    window.location.href = "home.html";
  });
  homeLink.addEventListener("keypress", (e) => {
    if (e.key === "Enter") window.location.href = "home.html";
  });
}
