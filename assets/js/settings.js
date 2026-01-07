const homeLink = document.getElementById("homeLink");
const tts = window.speechSynthesis;

// TTS helper
function speak(text) {
  if (tts.speaking) tts.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "en-US";
  tts.speak(utter);
}

// TTS feedback for interactive elements
document.querySelectorAll("input, select, button").forEach((el) => {
  el.addEventListener("change", () => {
    let value =
      el.type === "checkbox" ? (el.checked ? "enabled" : "disabled") : el.value;
    speak(
      `${
        el.previousElementSibling
          ? el.previousElementSibling.textContent
          : el.textContent
      } set to ${value}`
    );
  });

  el.addEventListener("focus", () => {
    speak(
      el.previousElementSibling
        ? el.previousElementSibling.textContent
        : el.textContent
    );
  });
});

// Clear history
const clearHistoryBtn = document.getElementById("clear-history");
if (clearHistoryBtn) {
  clearHistoryBtn.addEventListener("click", () => {
    localStorage.clear();
    speak("App history cleared");
  });
}

// Voice Help
const voiceHelpBtn = document.getElementById("voice-help");
if (voiceHelpBtn) {
  voiceHelpBtn.addEventListener("click", () => {
    speak(
      "This is voice guided help. Use tab to navigate and Enter to select."
    );
  });
}

// Contact Support
const contactSupportBtn = document.getElementById("contact-support");
if (contactSupportBtn) {
  contactSupportBtn.addEventListener("click", () => {
    speak("Contact support via email at support@example.com");
  });
}

// Home navigation - WITH SAFETY CHECK
if (homeLink) {
  homeLink.addEventListener(
    "click",
    () => (window.location.href = "home.html")
  );
  homeLink.addEventListener("keypress", (e) => {
    if (e.key === "Enter") window.location.href = "home.html";
  });
}
