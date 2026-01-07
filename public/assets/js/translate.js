const textInput = document.getElementById("textInput");
const fileInput = document.getElementById("fileInput");
const playBtn = document.getElementById("playBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resumeBtn = document.getElementById("resumeBtn");
const stopBtn = document.getElementById("stopBtn");
const clearBtn = document.getElementById("clearBtn");
const voiceSelect = document.getElementById("voiceSelect");
const rateInput = document.getElementById("rate");
const volumeInput = document.getElementById("volume");
const status = document.getElementById("status");

const synth = window.speechSynthesis;
let utterance;

// Load voices
function loadVoices() {
  const voices = synth.getVoices();
  voiceSelect.innerHTML = "";
  voices.forEach((voice, i) => {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = voice.name;
    voiceSelect.appendChild(option);
  });
}
loadVoices();
speechSynthesis.onvoiceschanged = loadVoices;

function speak(text) {
  if (!text) {
    announce("No text to read");
    return;
  }

  synth.cancel();
  utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = synth.getVoices()[voiceSelect.value];
  utterance.rate = rateInput.value;
  utterance.volume = volumeInput.value;

  utterance.onstart = () => announce("Reading started");
  utterance.onend = () => announce("Reading finished");

  synth.speak(utterance);
}

function announce(msg) {
  status.textContent = msg;
}

// Buttons
playBtn.onclick = () => speak(textInput.value);
pauseBtn.onclick = () => synth.pause();
resumeBtn.onclick = () => synth.resume();
stopBtn.onclick = () => synth.cancel();

clearBtn.onclick = () => {
  textInput.value = "";
  announce("Text cleared");
  speak("Text cleared");
};

// File upload (TXT fully supported)
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;

  if (file.type === "text/plain") {
    const reader = new FileReader();
    reader.onload = () => {
      textInput.value = reader.result;
      announce("Document loaded");
      speak("Document loaded");
    };
    reader.readAsText(file);
  } else {
    announce("Unsupported file type");
    speak("This file type is not supported yet");
  }
});
