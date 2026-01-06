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
document.getElementById("clear-history").addEventListener("click", () => {
  localStorage.clear();
  speak("App history cleared");
});

// Voice Help
document.getElementById("voice-help").addEventListener("click", () => {
  speak("This is voice guided help. Use tab to navigate and Enter to select.");
});

// Contact Support
document.getElementById("contact-support").addEventListener("click", () => {
  speak("Contact support via email at support@example.com");
});

// Home navigation
homeLink.addEventListener("click", () => (window.location.href = "home.html"));
homeLink.addEventListener("keypress", (e) => {
  if (e.key === "Enter") window.location.href = "home.html";
});
