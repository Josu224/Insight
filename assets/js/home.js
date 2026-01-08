// ============================================
// HOME PAGE - VOICE CONTROL & NAVIGATION
// ============================================

// --- Grab elements ---
const voiceBtn = document.getElementById("voiceBtn");
const voiceStatus = document.getElementById("voiceStatus");

// --- Speech Recognition Setup ---
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;
let recordingTimeout;
let isListening = false;

// --- Check microphone permission on page load ---
function checkMicrophonePermission() {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(() => {
        console.log("Microphone access granted");
        voiceStatus.textContent = "Hold and speak to select choice";
      })
      .catch((err) => {
        console.error("Microphone access denied:", err);
        voiceStatus.textContent =
          "Microphone access required. Please enable in browser settings.";
        voiceBtn.style.opacity = "0.5";
        voiceBtn.style.pointerEvents = "none";
        voiceBtn.title = "Microphone permission required";
      });
  }
}

// --- Voice feedback function ---
function speakFeedback(text) {
  if ("speechSynthesis" in window) {
    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    // Get available voices
    const voices = speechSynthesis.getVoices();
    if (voices.length > 0) {
      // Prefer English voices
      const englishVoice =
        voices.find((voice) => voice.lang.startsWith("en")) || voices[0];
      utterance.voice = englishVoice;
    }

    speechSynthesis.speak(utterance);
  }
}

// --- Initialize speech recognition ---
function initializeSpeechRecognition() {
  if (!SpeechRecognition) {
    console.warn("Speech Recognition API not supported in this browser.");
    voiceStatus.textContent = "Voice control not supported in this browser";
    voiceBtn.style.opacity = "0.5";
    voiceBtn.style.pointerEvents = "none";
    return;
  }

  recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.continuous = false; // Changed to false - better for single commands

  // --- Recognition event handlers ---

  recognition.onstart = () => {
    isListening = true;
    voiceBtn.classList.add("recording");
    voiceStatus.textContent = "Listening...";
    voiceStatus.classList.add("listening");

    // Stop recording automatically after 8 seconds
    recordingTimeout = setTimeout(() => {
      if (isListening) {
        recognition.stop();
        voiceStatus.textContent = "Listening timed out. Try again.";
        speakFeedback("Listening timed out");
      }
    }, 8000);
  };

  recognition.onresult = (event) => {
    const command = event.results[0][0].transcript.trim().toLowerCase();

    console.log("Recognized command:", command);

    // Clear timeout since we got a command
    clearTimeout(recordingTimeout);

    // Stop recognition immediately
    isListening = false;

    // Process the command
    processVoiceCommand(command);
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    isListening = false;
    voiceBtn.classList.remove("recording");
    voiceStatus.classList.remove("listening");
    clearTimeout(recordingTimeout);

    // Handle specific errors
    switch (event.error) {
      case "not-allowed":
      case "permission-denied":
        voiceStatus.textContent =
          "Microphone access denied. Please allow microphone access.";
        speakFeedback("Microphone permission required");
        break;
      case "network":
        voiceStatus.textContent =
          "Network error. Please check your internet connection.";
        speakFeedback("Network error");
        break;
      case "no-speech":
        voiceStatus.textContent = "No speech detected. Please speak clearly.";
        speakFeedback("No speech detected");
        break;
      case "audio-capture":
        voiceStatus.textContent =
          "No microphone found. Please check your microphone.";
        speakFeedback("Microphone not found");
        break;
      default:
        voiceStatus.textContent = "Voice recognition error. Please try again.";
        speakFeedback("Voice recognition failed");
    }

    // Reset status after 3 seconds
    setTimeout(() => {
      if (!isListening) {
        voiceStatus.textContent = "Hold and speak to select choice";
      }
    }, 3000);
  };

  recognition.onend = () => {
    isListening = false;
    voiceBtn.classList.remove("recording");
    voiceStatus.classList.remove("listening");
    clearTimeout(recordingTimeout);

    // Reset status if no command was processed
    if (
      voiceStatus.textContent === "Listening..." ||
      voiceStatus.textContent.includes("error") ||
      voiceStatus.textContent.includes("timed out")
    ) {
      setTimeout(() => {
        voiceStatus.textContent = "Hold and speak to select choice";
      }, 2000);
    }
  };
}

// --- Process voice commands ---
function processVoiceCommand(command) {
  let actionTaken = null;
  let destination = null;

  // More flexible command matching
  if (
    command.includes("navigate") ||
    command.includes("navigation") ||
    command.includes("direction")
  ) {
    actionTaken = "Navigation";
    destination = "navigation.html";
  } else if (
    command.includes("assistant") ||
    command.includes("help") ||
    command.includes("ai")
  ) {
    actionTaken = "Assistant";
    destination = "assistant.html";
  } else if (
    command.includes("call") ||
    command.includes("phone") ||
    command.includes("dial")
  ) {
    actionTaken = "Call";
    destination = "call.html";
  } else if (
    command.includes("settings") ||
    command.includes("setup") ||
    command.includes("config")
  ) {
    actionTaken = "Settings";
    destination = "settings.html";
  } else if (
    command.includes("detect") ||
    command.includes("detection") ||
    command.includes("identify")
  ) {
    actionTaken = "Detection";
    destination = "detect.html";
  } else if (
    command.includes("translate") ||
    command.includes("translation") ||
    command.includes("language")
  ) {
    actionTaken = "Translation";
    destination = "translate.html";
  } else if (
    command.includes("home") ||
    command.includes("main") ||
    command.includes("dashboard")
  ) {
    actionTaken = "Home";
    // Already on home page
    voiceStatus.textContent = "You are already on the home page";
    speakFeedback("You are already on the home page");
    return;
  }

  if (actionTaken && destination) {
    // Visual feedback
    voiceStatus.textContent = `${actionTaken} selected!`;
    voiceStatus.style.color = "#4CAF50";

    // Voice feedback
    speakFeedback(`${actionTaken} selected. Opening now.`);

    // Highlight the corresponding button briefly
    const buttonId = actionTaken.toLowerCase() + "Btn";
    const button = document.getElementById(buttonId);
    if (button) {
      button.classList.add("active");
      setTimeout(() => button.classList.remove("active"), 1000);
    }

    // Navigate after a short delay for feedback
    setTimeout(() => {
      window.location.href = destination;
    }, 1200);
  } else {
    // Command not recognized
    voiceStatus.textContent = `"${command}" not recognized. Try "Navigate", "Assistant", etc.`;
    voiceStatus.style.color = "#ff5252";
    speakFeedback(
      `Command "${command}" not recognized. Say "Navigate", "Assistant", "Call", "Settings", "Detect", or "Translate".`
    );

    // Reset after 3 seconds
    setTimeout(() => {
      voiceStatus.textContent = "Hold and speak to select choice";
      voiceStatus.style.color = "";
    }, 3000);
  }
}

// --- Start recognition ---
function startRecognition() {
  if (!recognition) {
    console.error("Speech recognition not initialized");
    return;
  }

  if (isListening) {
    console.log("Already listening");
    return;
  }

  try {
    recognition.start();
  } catch (err) {
    console.error("Speech recognition start failed:", err);
    voiceStatus.textContent =
      "Voice recognition failed to start. Please refresh the page.";
    speakFeedback("Voice recognition failed");
  }
}

// --- Stop recognition ---
function stopRecognition() {
  if (recognition && isListening) {
    try {
      recognition.stop();
    } catch (err) {
      console.error("Error stopping recognition:", err);
    }
  }
}

// --- Long press logic ---
let pressTimer;

function handlePressStart() {
  pressTimer = setTimeout(startRecognition, 300);

  // Immediate visual feedback
  voiceBtn.style.transform = "scale(0.95)";
}

function handlePressEnd() {
  clearTimeout(pressTimer);
  voiceBtn.style.transform = "scale(1)";

  // If already listening, stop on release
  if (isListening) {
    stopRecognition();
  }
}

// --- Action buttons navigation ---
const buttonActions = {
  navigateBtn: "navigation.html",
  assistantBtn: "assistant.html",
  callBtn: "call.html",
  settingsBtn: "settings.html",
  detectBtn: "detect.html",
  translateBtn: "translate.html",
};

// Setup button click events
for (const [id, url] of Object.entries(buttonActions)) {
  const btn = document.getElementById(id);
  if (btn) {
    btn.addEventListener("click", () => {
      // Visual feedback
      btn.classList.add("active");

      // Voice feedback based on button
      const actionName = id.replace("Btn", "");
      speakFeedback(
        `${
          actionName.charAt(0).toUpperCase() + actionName.slice(1)
        } selected. Opening now.`
      );

      // Navigate after short delay
      setTimeout(() => {
        window.location.href = url;
      }, 800);
    });
  }
}

// --- Press/touch animation for all action buttons ---
const buttons = document.querySelectorAll(".action-btn");
buttons.forEach((btn) => {
  const press = () => {
    btn.style.transform = "scale(0.96)";
    btn.style.transition = "transform 0.1s ease";
  };

  const release = () => {
    btn.style.transform = "scale(1)";
  };

  btn.addEventListener("mousedown", press);
  btn.addEventListener("mouseup", release);
  btn.addEventListener("mouseleave", release);
  btn.addEventListener("touchstart", press);
  btn.addEventListener("touchend", release);
});

// --- Event listeners for voice button ---
voiceBtn.addEventListener("mousedown", handlePressStart);
voiceBtn.addEventListener("mouseup", handlePressEnd);
voiceBtn.addEventListener("mouseleave", handlePressEnd);

voiceBtn.addEventListener("touchstart", handlePressStart);
voiceBtn.addEventListener("touchend", handlePressEnd);

// Prevent context menu on long press
voiceBtn.addEventListener("contextmenu", (e) => e.preventDefault());

// --- Initialize everything when page loads ---
document.addEventListener("DOMContentLoaded", () => {
  console.log("Home page loaded - initializing voice control");

  // Check microphone permission
  checkMicrophonePermission();

  // Initialize speech recognition
  initializeSpeechRecognition();

  // Load voices for speech synthesis
  if ("speechSynthesis" in window) {
    speechSynthesis.onvoiceschanged = () => {
      console.log("Voices loaded for speech synthesis");
    };
  }
});

// --- Keyboard shortcuts for accessibility ---
document.addEventListener("keydown", (e) => {
  // Space or Enter on voice button
  if (
    (e.key === " " || e.key === "Enter") &&
    document.activeElement === voiceBtn
  ) {
    e.preventDefault();
    startRecognition();
  }

  // Number keys 1-6 for action buttons
  if (e.key >= "1" && e.key <= "6") {
    const index = parseInt(e.key) - 1;
    const buttonIds = Object.keys(buttonActions);

    if (buttonIds[index]) {
      const button = document.getElementById(buttonIds[index]);
      if (button) {
        button.click();
      }
    }
  }

  // Escape to stop listening
  if (e.key === "Escape" && isListening) {
    stopRecognition();
    speakFeedback("Listening cancelled");
  }
});

console.log("Home page JavaScript initialized");
