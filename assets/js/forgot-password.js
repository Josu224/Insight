const submitBtn = document.getElementById("submitBtn");
const statusMsg = document.getElementById("statusMsg");
const backBtn = document.getElementById("backBtn");
const emailInput = document.getElementById("email");

let tts = window.speechSynthesis;

// TTS helper
function speak(text) {
  if (tts.speaking) tts.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "en-US";
  tts.speak(utter);
}

// Handle submit
if (submitBtn && emailInput && statusMsg) {
  submitBtn.addEventListener("click", () => {
    const email = emailInput.value.trim();
    if (!email) {
      statusMsg.textContent = "Please enter a valid email address.";
      speak("Please enter a valid email address.");
      return;
    }

    // Simulate sending reset link (replace with real API)
    statusMsg.textContent = `Reset link sent to ${email}. Check your inbox.`;
    speak(`Reset link sent to ${email}. Check your inbox.`);
    emailInput.value = "";
  });

  // Enter key support for accessibility
  emailInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") submitBtn.click();
  });
}

// Back to Sign In navigation
if (backBtn) {
  backBtn.addEventListener("click", () => {
    window.location.href = "signin.html";
  });

  backBtn.addEventListener("keypress", (e) => {
    if (e.key === "Enter") window.location.href = "signin.html";
  });
}
