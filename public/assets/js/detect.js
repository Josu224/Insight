// DOM Elements
const video = document.getElementById("video");
const overlay = document.getElementById("overlay");
const ctx = overlay.getContext("2d");
const confidenceSlider = document.getElementById("confidence");
const categorySelect = document.getElementById("category");
const ttsVoiceSelect = document.getElementById("ttsVoice");
const ttsSpeed = document.getElementById("ttsSpeed");
const audioOnly = document.getElementById("audioOnly");
const historyList = document.getElementById("historyList");
const homeBtn = document.getElementById("homeBtn");

let tts = window.speechSynthesis;
let selectedVoice;

// Populate TTS voices
function populateVoices() {
  const voices = tts.getVoices();
  ttsVoiceSelect.innerHTML = "";
  voices.forEach((voice) => {
    const option = document.createElement("option");
    option.value = voice.name;
    option.textContent = `${voice.name} (${voice.lang})`;
    ttsVoiceSelect.appendChild(option);
  });
  selectedVoice = voices[0];
}
tts.onvoiceschanged = populateVoices;

// Start camera
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
      audio: false,
    });
    video.srcObject = stream;
  } catch (err) {
    alert("Camera access denied or unavailable.");
  }
}
startCamera();

// Dummy object detection for demonstration
function detectObjects() {
  ctx.clearRect(0, 0, overlay.width, overlay.height);
  // Example detected object
  const obj = {
    label: "person",
    x: 50,
    y: 50,
    width: 100,
    height: 200,
    confidence: 0.8,
  };
  if (
    obj.confidence >= parseFloat(confidenceSlider.value) &&
    (categorySelect.value === "all" || categorySelect.value === obj.label)
  ) {
    if (!audioOnly.checked) {
      ctx.strokeStyle = "#1a73e8";
      ctx.lineWidth = 3;
      ctx.strokeRect(obj.x, obj.y, obj.width, obj.height);
      ctx.font = "18px Arial";
      ctx.fillStyle = "#1a73e8";
      ctx.fillText(
        `${obj.label} ${(obj.confidence * 100).toFixed(0)}%`,
        obj.x,
        obj.y - 5
      );
    }
    speak(
      `Detected ${obj.label} with ${(obj.confidence * 100).toFixed(
        0
      )} percent confidence`
    );
    addHistory(obj.label);
  }
}

function addHistory(label) {
  const li = document.createElement("li");
  li.textContent = `${new Date().toLocaleTimeString()}: ${label}`;
  historyList.prepend(li);
  if (historyList.children.length > 5)
    historyList.removeChild(historyList.lastChild);
}

// TTS helper
function speak(text) {
  if (!text) return;
  if (tts.speaking) tts.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.voice =
    tts.getVoices().find((v) => v.name === ttsVoiceSelect.value) ||
    selectedVoice;
  utter.rate = parseFloat(ttsSpeed.value);
  tts.speak(utter);
}

// Loop detection
setInterval(detectObjects, 5000); // every 5s

// Home button
homeBtn.addEventListener("click", () => (window.location.href = "home.html"));
homeBtn.addEventListener("keypress", (e) => {
  if (e.key === "Enter") window.location.href = "home.html";
});
