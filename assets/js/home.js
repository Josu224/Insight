// --- Grab elements ---
const voiceBtn = document.getElementById("voiceBtn");
const voiceStatus = document.getElementById("voiceStatus");

// --- Speech Recognition Setup ---
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;
let recordingTimeout;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.continuous = true; // keep listening until we manually stop

  recognition.onstart = () => {
    voiceBtn.classList.add("recording");
    voiceStatus.textContent = "Listening...";

    // Stop recording automatically after 10 seconds
    recordingTimeout = setTimeout(() => {
      recognition.stop();
    }, 10000);
  };

  recognition.onresult = (event) => {
    const command = event.results[event.results.length - 1][0].transcript
      .trim()
      .toLowerCase();
    console.log("Recognized command:", command);

    if (command.includes("navigate")) {
      window.location.href = "navigation.html";
    } else if (command.includes("assistant")) {
      window.location.href = "assistant.html";
    } else if (command.includes("call")) {
      window.location.href = "call.html";
    } else if (command.includes("settings")) {
      window.location.href = "settings.html";
    } else if (command.includes("detect")) {
      window.location.href = "detect.html";
    } else if (command.includes("translate")) {
      window.location.href = "translate.html";
    } else {
      voiceStatus.textContent = "Command not recognized";
    }
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    voiceStatus.textContent = "Could not recognize speech. Try again.";
    voiceBtn.classList.remove("recording");
    clearTimeout(recordingTimeout);
  };

  recognition.onend = () => {
    voiceBtn.classList.remove("recording");
    clearTimeout(recordingTimeout);
    if (!voiceStatus.textContent.includes("Command")) {
      voiceStatus.textContent = "Hold and speak to select choice";
    }
  };
} else {
  console.warn("Speech Recognition API not supported in this browser.");
  voiceStatus.textContent = "Speech recognition not supported";
}

// --- Start recognition ---
function startRecognition() {
  if (recognition && !voiceBtn.classList.contains("recording")) {
    try {
      recognition.start();
    } catch (err) {
      console.error("Speech recognition start failed:", err);
      voiceStatus.textContent = "Microphone access denied or not available.";
    }
  }
}

// --- Long press logic ---
let pressTimer;

function handlePressStart() {
  pressTimer = setTimeout(startRecognition, 300);
}

function handlePressEnd() {
  clearTimeout(pressTimer);
}

// --- Event listeners for desktop ---
voiceBtn.addEventListener("mousedown", handlePressStart);
voiceBtn.addEventListener("mouseup", handlePressEnd);
voiceBtn.addEventListener("mouseleave", handlePressEnd);

// --- Event listeners for mobile / touch ---
voiceBtn.addEventListener("touchstart", handlePressStart);
voiceBtn.addEventListener("touchend", handlePressEnd);

// --- Action buttons navigation ---
const buttonActions = {
  navigateBtn: "navigation.html",
  assistantBtn: "assistant.html",
  callBtn: "call.html",
  settingsBtn: "settings.html",
  detectBtn: "detect.html",
  translateBtn: "translate.html",
};

for (const [id, url] of Object.entries(buttonActions)) {
  const btn = document.getElementById(id);
  if (btn) btn.addEventListener("click", () => (window.location.href = url));
}

// --- Press/touch animation for all action buttons ---
const buttons = document.querySelectorAll(".action-btn");
buttons.forEach((btn) => {
  const press = () => (btn.style.transform = "scale(0.96)");
  const release = () => (btn.style.transform = "scale(1)");

  btn.addEventListener("mousedown", press);
  btn.addEventListener("mouseup", release);
  btn.addEventListener("mouseleave", release);
  btn.addEventListener("touchstart", press);
  btn.addEventListener("touchend", release);
});
recognition.onerror = (event) => {
  console.error("Speech recognition error:", event.error);
  if (event.error === "network") {
    voiceStatus.textContent = "Network error: check your internet connection";
  } else {
    voiceStatus.textContent = "Could not recognize speech. Try again.";
  }
  voiceBtn.classList.remove("recording");
};
