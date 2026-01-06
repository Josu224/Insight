// permission.html JavaScript enhancements

// Double Tap to Decline Feature
class DoubleTapHandler {
  constructor() {
    this.tapCount = 0;
    this.lastTapTime = 0;
    this.tapTimeout = null;
    this.doubleTapDelay = 300; // 300ms for double-tap detection
    this.isDeclining = false;

    this.init();
  }

  init() {
    const declineElement = document.querySelector(".decline");

    if (!declineElement) {
      console.error("Decline element not found!");
      return;
    }

    // Add event listeners for different interaction methods
    declineElement.addEventListener("click", this.handleTap.bind(this));
    declineElement.addEventListener("keydown", this.handleKeyPress.bind(this));

    // Make it focusable for keyboard users
    declineElement.setAttribute("tabindex", "0");
    declineElement.setAttribute("role", "button");
    declineElement.setAttribute(
      "aria-label",
      "Double tap or press Enter twice to decline"
    );

    // Add visual feedback for focus
    declineElement.style.outline = "none"; // We'll handle focus with CSS

    // Speak instruction on focus
    declineElement.addEventListener("focus", () => {
      this.speakFeedback("Double tap or press Enter twice to decline");
    });
  }

  handleTap(event) {
    event.preventDefault();
    event.stopPropagation();

    const currentTime = new Date().getTime();
    const timeSinceLastTap = currentTime - this.lastTapTime;

    // Clear previous timeout if exists
    if (this.tapTimeout) {
      clearTimeout(this.tapTimeout);
    }

    // First tap
    if (this.tapCount === 0) {
      this.tapCount = 1;
      this.lastTapTime = currentTime;

      // Speak feedback for first tap
      this.speakFeedback("Tap again to confirm decline");

      // Visual feedback
      this.showTapFeedback(1);

      // Set timeout to reset tap count
      this.tapTimeout = setTimeout(() => {
        this.resetTap();
        this.speakFeedback("Tap timed out. Please try again");
      }, this.doubleTapDelay);
    }
    // Second tap within time limit
    else if (this.tapCount === 1 && timeSinceLastTap < this.doubleTapDelay) {
      this.tapCount = 2;
      clearTimeout(this.tapTimeout);

      // Execute decline action
      this.executeDecline();
    }
  }

  handleKeyPress(event) {
    // Handle Enter key for accessibility
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();

      const currentTime = new Date().getTime();
      const timeSinceLastTap = currentTime - this.lastTapTime;

      // Clear previous timeout if exists
      if (this.tapTimeout) {
        clearTimeout(this.tapTimeout);
      }

      // First Enter press
      if (this.tapCount === 0) {
        this.tapCount = 1;
        this.lastTapTime = currentTime;

        // Speak feedback
        this.speakFeedback("Press Enter again to confirm decline");

        // Visual feedback
        this.showTapFeedback(1);

        // Set timeout
        this.tapTimeout = setTimeout(() => {
          this.resetTap();
          this.speakFeedback("Action timed out. Please try again");
        }, this.doubleTapDelay);
      }
      // Second Enter press within time limit
      else if (this.tapCount === 1 && timeSinceLastTap < this.doubleTapDelay) {
        this.tapCount = 2;
        clearTimeout(this.tapTimeout);

        // Execute decline action
        this.executeDecline();
      }
    }
  }

  executeDecline() {
    if (this.isDeclining) return;

    this.isDeclining = true;
    const declineElement = document.querySelector(".decline");

    // Speak confirmation
    this.speakFeedback("Declining... Action confirmed");

    // Add visual confirmation
    declineElement.classList.add("declining-active");

    // Add sparkle animation
    const sparkleIcon = declineElement.querySelector(".sparkle-icon");
    if (sparkleIcon) {
      sparkleIcon.classList.add("sparkle-animation");
    }

    // Simulate decline action (you'll replace this with your actual decline logic)
    setTimeout(() => {
      this.performActualDecline();
    }, 800);
  }

  performActualDecline() {
    // This is where you put your actual decline logic
    console.log("Decline action executed!");

    // Example actions you might want to do:
    // 1. Close a modal
    // 2. Cancel an operation
    // 3. Navigate back
    // 4. Reset a form

    // For demonstration, let's show an alert and reset
    this.speakFeedback("Action declined successfully");

    // Show visual feedback
    this.showSuccessFeedback();

    // Reset after completion
    setTimeout(() => {
      this.resetDecline();
    }, 1500);
  }

  resetTap() {
    this.tapCount = 0;
    this.lastTapTime = 0;
    this.tapTimeout = null;

    // Remove visual feedback
    const declineElement = document.querySelector(".decline");
    declineElement.classList.remove("tap-1");

    // Reset sparkle icon
    const sparkleIcon = declineElement.querySelector(".sparkle-icon");
    if (sparkleIcon) {
      sparkleIcon.classList.remove("sparkle-animation");
    }
  }

  resetDecline() {
    this.isDeclining = false;
    this.resetTap();

    const declineElement = document.querySelector(".decline");
    declineElement.classList.remove("declining-active", "decline-success");
  }

  showTapFeedback(tapNumber) {
    const declineElement = document.querySelector(".decline");

    // Remove previous feedback
    declineElement.classList.remove("tap-1", "tap-2");

    // Add current feedback
    declineElement.classList.add(`tap-${tapNumber}`);

    // Add pulse animation
    declineElement.style.animation = "pulse 0.3s ease";
    setTimeout(() => {
      declineElement.style.animation = "";
    }, 300);
  }

  showSuccessFeedback() {
    const declineElement = document.querySelector(".decline");
    declineElement.classList.add("decline-success");

    // Change text temporarily
    const originalText = declineElement.innerHTML;
    declineElement.innerHTML = '<i class="fa-solid fa-check"></i> Declined!';

    // Restore original text after 1.5 seconds
    setTimeout(() => {
      declineElement.innerHTML = originalText;
      declineElement.classList.remove("decline-success");
    }, 1500);
  }

  speakFeedback(message) {
    // For a real app, use Web Speech API
    // For now, we'll use console and visual feedback
    console.log(`Voice feedback: ${message}`);

    // You can implement Web Speech API like this:
    /*
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(message);
            utterance.rate = 0.9;
            utterance.pitch = 1;
            speechSynthesis.speak(utterance);
        }
        */

    // Show visual status message
    this.showStatusMessage(message);
  }

  showStatusMessage(message) {
    // Create or update status message element
    let statusMsg = document.getElementById("doubleTapStatus");
    if (!statusMsg) {
      statusMsg = document.createElement("div");
      statusMsg.id = "doubleTapStatus";
      statusMsg.className = "status-message";
      statusMsg.setAttribute("role", "status");
      statusMsg.setAttribute("aria-live", "polite");
      document.body.appendChild(statusMsg);
    }

    statusMsg.textContent = message;
    statusMsg.classList.add("show");

    // Hide after delay
    setTimeout(() => {
      statusMsg.classList.remove("show");
    }, 2000);
  }
}

// Enhanced CSS for the double tap feature
const doubleTapStyles = `
/* Add these to your existing CSS */

/* Tap feedback states */
.decline.tap-1 {
    color: #ff9800 !important;
    transform: scale(1.05);
    transition: all 0.2s ease;
}

.decline.tap-2 {
    color: #ff5252 !important;
    transform: scale(1.1);
    transition: all 0.2s ease;
}

/* Active declining state */
.decline.declining-active {
    color: #ff5252 !important;
    font-weight: bold;
    animation: shake 0.5s ease-in-out;
}

/* Success state */
.decline.decline-success {
    color: #4caf50 !important;
    font-weight: bold;
}

/* Sparkle animation */
.sparkle-icon.sparkle-animation {
    animation: sparkle 0.8s ease-in-out;
    color: #ff9800;
}

/* Status message */
.status-message {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%) translateY(-20px);
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 14px;
    z-index: 10000;
    opacity: 0;
    transition: opacity 0.3s, transform 0.3s;
    pointer-events: none;
    max-width: 80%;
    text-align: center;
    border: 2px solid var(--primary-color, #4a9eff);
}

.status-message.show {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
}

/* Animations */
@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
}

@keyframes sparkle {
    0% { transform: scale(1) rotate(0deg); opacity: 1; }
    50% { transform: scale(1.3) rotate(180deg); opacity: 0.8; }
    100% { transform: scale(1) rotate(360deg); opacity: 1; }
}

/* Focus styles for accessibility */
.decline:focus {
    outline: 3px solid #4a9eff;
    outline-offset: 4px;
    border-radius: 4px;
}

/* Hover effect */
.decline:hover {
    color: #7aa7ff !important;
    transform: scale(1.02);
    transition: all 0.2s ease;
}
`;

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Add the styles to the page
  const styleSheet = document.createElement("style");
  styleSheet.textContent = doubleTapStyles;
  document.head.appendChild(styleSheet);

  // Initialize the double tap handler
  const doubleTapHandler = new DoubleTapHandler();

  // Optional: Add keyboard shortcut (Escape key for quick decline)
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      const declineElement = document.querySelector(".decline");
      if (declineElement) {
        declineElement.focus();
        doubleTapHandler.speakFeedback(
          "Press Enter twice to decline, or press Escape again to cancel"
        );
      }
    }
  });

  console.log("Double Tap to Decline feature initialized");
});

// signup.html JavaScript inclusion

// Signup Page JavaScript
document.addEventListener("DOMContentLoaded", function () {
  console.log("Signup page loaded");

  // Initialize features
  initDoubleTapQuit();
  initPasskeyValidation();
  initAccessibilityFeatures();
  initVoiceGuidance();
});

// 1. DOUBLE TAP TO QUIT FEATURE
function initDoubleTapQuit() {
  const quitHint = document.querySelector(".quit-hint");
  if (!quitHint) return;

  let tapCount = 0;
  let lastTapTime = 0;
  let tapTimeout = null;
  const DOUBLE_TAP_DELAY = 300; // 300ms for double tap

  // Make quit hint interactive
  quitHint.style.pointerEvents = "auto";
  quitHint.style.cursor = "pointer";
  quitHint.setAttribute("role", "button");
  quitHint.setAttribute("tabindex", "0");
  quitHint.setAttribute(
    "aria-label",
    "Double tap or double press Enter to quit the application"
  );

  // Add visual styles for interactive state
  quitHint.style.transition = "all 0.3s ease";

  // Speak instruction when focused
  quitHint.addEventListener("focus", function () {
    speakFeedback("Double tap or press Enter twice to quit the application");
  });

  // Click/Touch handler
  quitHint.addEventListener("click", function (e) {
    e.preventDefault();
    handleQuitInteraction();
  });

  // Keyboard handler
  quitHint.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleQuitInteraction();
    }
  });

  // Hover effect
  quitHint.addEventListener("mouseenter", function () {
    quitHint.style.color = "#ffffff";
    quitHint.style.transform = "scale(1.05)";
  });

  quitHint.addEventListener("mouseleave", function () {
    quitHint.style.color = "rgba(157, 184, 255, 0.8)";
    quitHint.style.transform = "scale(1)";
  });

  // Focus effect
  quitHint.addEventListener("focus", function () {
    quitHint.style.outline = "2px solid #9db8ff";
    quitHint.style.outlineOffset = "4px";
    quitHint.style.borderRadius = "4px";
  });

  quitHint.addEventListener("blur", function () {
    quitHint.style.outline = "none";
  });

  function handleQuitInteraction() {
    const currentTime = new Date().getTime();
    const timeSinceLastTap = currentTime - lastTapTime;

    // Clear previous timeout
    if (tapTimeout) {
      clearTimeout(tapTimeout);
    }

    // First tap
    if (tapCount === 0) {
      tapCount = 1;
      lastTapTime = currentTime;

      // Visual feedback for first tap
      quitHint.classList.add("first-tap");
      speakFeedback("Tap again to confirm quit");

      // Reset after delay
      tapTimeout = setTimeout(() => {
        resetQuitTap();
        speakFeedback("Tap timed out. Please try again");
      }, DOUBLE_TAP_DELAY);
    }
    // Second tap within time limit
    else if (tapCount === 1 && timeSinceLastTap < DOUBLE_TAP_DELAY) {
      tapCount = 2;
      clearTimeout(tapTimeout);

      // Execute quit action
      executeQuit();
    }
  }

  function resetQuitTap() {
    tapCount = 0;
    lastTapTime = 0;
    tapTimeout = null;
    quitHint.classList.remove("first-tap", "second-tap");
  }

  function executeQuit() {
    // Visual feedback
    quitHint.classList.add("second-tap");
    speakFeedback("Quitting application...");

    // Show quitting animation
    quitHint.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Quitting...';

    // Simulate quit action (redirect to home or close)
    setTimeout(() => {
      // In a real app, you might:
      // 1. Close the app (if it's a PWA)
      // 2. Navigate to home page
      // 3. Show confirmation dialog

      // For this example, we'll simulate going back to previous page
      speakFeedback("Application closed");

      // If there's a previous page, go back, otherwise go to home
      if (window.history.length > 1) {
        window.history.back();
      } else {
        // You could redirect to a home page
        // window.location.href = 'index.html';

        // For now, just reset the hint
        setTimeout(() => {
          quitHint.innerHTML = "Double tap to quit";
          resetQuitTap();
        }, 1000);
      }
    }, 1000);
  }

  // Add CSS for tap states
  const tapStyles = `
        .quit-hint.first-tap {
            color: #ff9800 !important;
            font-weight: bold;
            animation: pulse 0.3s ease;
        }
        
        .quit-hint.second-tap {
            color: #ff5252 !important;
            font-weight: bold;
            animation: pulse 0.5s ease;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        
        .fa-spinner {
            margin-right: 8px;
        }
    `;

  const styleSheet = document.createElement("style");
  styleSheet.textContent = tapStyles;
  document.head.appendChild(styleSheet);
}

// 2. PASSKEY VALIDATION
function initPasskeyValidation() {
  const passkeyInputs = document.querySelectorAll(".passkey-input input");

  if (passkeyInputs.length >= 2) {
    const firstPasskey = passkeyInputs[0];
    const confirmPasskey = passkeyInputs[1];

    // Real-time validation
    confirmPasskey.addEventListener("input", function () {
      validatePasskeys(firstPasskey, confirmPasskey);
    });

    firstPasskey.addEventListener("input", function () {
      validatePasskeys(firstPasskey, confirmPasskey);
    });

    // Form submission handler
    const welcomeBtn = document.querySelector(".welcome-btn");
    if (welcomeBtn) {
      welcomeBtn.addEventListener("click", function (e) {
        if (!validateForm()) {
          e.preventDefault();
          speakFeedback("Please fix the passkey errors before continuing");
        }
      });
    }
  }

  function validatePasskeys(first, second) {
    const firstValue = first.value.trim();
    const secondValue = second.value.trim();

    // Check word count (should be exactly 4 words)
    const wordCount = firstValue
      .split(/\s+/)
      .filter((word) => word.length > 0).length;

    if (firstValue && wordCount !== 4) {
      showPasskeyError(first, "Passkey must be exactly 4 words");
      return false;
    }

    // Clear error if word count is correct
    if (wordCount === 4) {
      clearPasskeyError(first);
    }

    // Check if passwords match
    if (firstValue && secondValue && firstValue !== secondValue) {
      showPasskeyError(second, "Passkeys do not match");
      return false;
    }

    // Clear error if they match
    if (firstValue === secondValue) {
      clearPasskeyError(second);
    }

    return true;
  }

  function showPasskeyError(inputElement, message) {
    // Remove any existing error
    clearPasskeyError(inputElement);

    // Add error class to parent
    const parentDiv = inputElement.closest(".passkey-input");
    if (parentDiv) {
      parentDiv.classList.add("error");
    }

    // Create error message
    const errorElement = document.createElement("div");
    errorElement.className = "passkey-error";
    errorElement.textContent = message;
    errorElement.style.color = "#ff5252";
    errorElement.style.fontSize = "12px";
    errorElement.style.marginTop = "5px";

    // Insert after the input container
    const form = inputElement.closest(".passkey-form");
    if (form) {
      form.appendChild(errorElement);
    }

    // Speak error for accessibility
    speakFeedback(message);
  }

  function clearPasskeyError(inputElement) {
    const parentDiv = inputElement.closest(".passkey-input");
    if (parentDiv) {
      parentDiv.classList.remove("error");
    }

    // Remove error message
    const form = inputElement.closest(".passkey-form");
    if (form) {
      const errorElement = form.querySelector(".passkey-error");
      if (errorElement) {
        errorElement.remove();
      }
    }
  }

  function validateForm() {
    const passkeyInputs = document.querySelectorAll(".passkey-input input");
    const firstPasskey = passkeyInputs[0];
    const confirmPasskey = passkeyInputs[1];

    // Check if both fields are filled
    if (!firstPasskey.value.trim() || !confirmPasskey.value.trim()) {
      speakFeedback("Please fill in both passkey fields");
      return false;
    }

    // Validate word count
    const wordCount = firstPasskey.value
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    if (wordCount !== 4) {
      speakFeedback("Passkey must be exactly 4 words");
      return false;
    }

    // Check if passwords match
    if (firstPasskey.value.trim() !== confirmPasskey.value.trim()) {
      speakFeedback("Passkeys do not match");
      return false;
    }

    return true;
  }

  // Add CSS for passkey validation
  const validationStyles = `
        .passkey-input.error {
            border-color: #ff5252 !important;
            animation: shake 0.5s ease-in-out;
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .passkey-error {
            color: #ff5252;
            font-size: 12px;
            margin-top: 5px;
            text-align: left;
            max-width: 260px;
            margin-left: auto;
            margin-right: auto;
        }
    `;

  const styleSheet = document.createElement("style");
  styleSheet.textContent = validationStyles;
  document.head.appendChild(styleSheet);
}

// 3. ACCESSIBILITY ENHANCEMENTS
function initAccessibilityFeatures() {
  // Make all interactive elements keyboard accessible
  const interactiveElements = document.querySelectorAll(
    "button, input, .quit-hint"
  );

  interactiveElements.forEach((element) => {
    // Ensure proper tabindex
    if (
      !element.hasAttribute("tabindex") &&
      element.tagName !== "INPUT" &&
      element.tagName !== "BUTTON"
    ) {
      element.setAttribute("tabindex", "0");
    }

    // Add focus styles
    element.addEventListener("focus", function () {
      this.style.outline = "2px solid #9db8ff";
      this.style.outlineOffset = "4px";
      this.style.borderRadius = "4px";
    });

    element.addEventListener("blur", function () {
      this.style.outline = "none";
    });
  });

  // Improve form accessibility
  const forms = document.querySelectorAll("form");
  forms.forEach((form, index) => {
    form.setAttribute("aria-label", `Passkey form ${index + 1}`);
  });

  // Welcome button enhancements
  const welcomeBtn = document.querySelector(".welcome-btn");
  if (welcomeBtn) {
    welcomeBtn.setAttribute(
      "aria-label",
      "Welcome button. Create account with your passkey"
    );

    // Add loading state
    welcomeBtn.addEventListener("click", function (e) {
      if (validateForm()) {
        // Add loading animation
        const originalText = this.innerHTML;
        this.innerHTML =
          '<i class="fas fa-spinner fa-spin"></i> Creating account...';
        this.disabled = true;

        // Simulate account creation process
        setTimeout(() => {
          this.innerHTML = originalText;
          this.disabled = false;
          speakFeedback(
            "Account created successfully! Redirecting to sign in page..."
          );
        }, 1500);
      }
    });
  }

  // Add skip to main content link if not present
  if (!document.querySelector(".skip-link")) {
    const skipLink = document.createElement("a");
    skipLink.href = "#main-content";
    skipLink.className = "skip-link";
    skipLink.textContent = "Skip to main content";
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add main content id
    const mainContent = document.querySelector(".passkey-form")?.parentElement;
    if (mainContent) {
      mainContent.id = "main-content";
    }
  }

  // Add CSS for skip link
  const skipLinkStyles = `
        .skip-link {
            position: absolute;
            top: -40px;
            left: 0;
            background: #9db8ff;
            color: #2d2c2e;
            padding: 8px 16px;
            text-decoration: none;
            font-weight: bold;
            border-radius: 0 0 8px 0;
            z-index: 1000;
        }
        
        .skip-link:focus {
            top: 0;
        }
    `;

  const styleSheet = document.createElement("style");
  styleSheet.textContent = skipLinkStyles;
  document.head.appendChild(styleSheet);
}

// 4. VOICE GUIDANCE SYSTEM
function initVoiceGuidance() {
  // Status message element for voice feedback
  let statusMessage = document.getElementById("voiceStatus");
  if (!statusMessage) {
    statusMessage = document.createElement("div");
    statusMessage.id = "voiceStatus";
    statusMessage.className = "voice-status-message";
    statusMessage.setAttribute("aria-live", "polite");
    statusMessage.setAttribute("role", "status");
    document.body.appendChild(statusMessage);
  }

  // Voice feedback function
  window.speakFeedback = function (message, priority = "polite") {
    console.log("Voice feedback:", message);

    // Update ARIA live region
    statusMessage.setAttribute("aria-live", priority);
    statusMessage.textContent = message;
    statusMessage.classList.add("show");

    // Hide after delay
    setTimeout(
      () => {
        statusMessage.classList.remove("show");
      },
      priority === "assertive" ? 5000 : 3000
    );

    // Optional: Use Web Speech API for actual voice
    // speakWithTTS(message);
  };

  // Optional: Web Speech API integration
  function speakWithTTS(text) {
    if ("speechSynthesis" in window) {
      // Cancel any ongoing speech
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      // Configure voice settings
      utterance.rate = 0.9; // Slightly slower for clarity
      utterance.pitch = 1;
      utterance.volume = 1;

      // Get available voices and select a good one
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        // Prefer natural-sounding voices
        const preferredVoice =
          voices.find(
            (voice) =>
              voice.lang.startsWith("en") && voice.name.includes("Natural")
          ) || voices[0];

        utterance.voice = preferredVoice;
      }

      speechSynthesis.speak(utterance);
    }
  }

  // CSS for voice status messages
  const voiceStyles = `
        .voice-status-message {
            position: fixed;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%) translateY(20px);
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s, transform 0.3s;
            pointer-events: none;
            max-width: 80%;
            text-align: center;
            border: 2px solid #9db8ff;
        }
        
        .voice-status-message.show {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    `;

  const styleSheet = document.createElement("style");
  styleSheet.textContent = voiceStyles;
  document.head.appendChild(styleSheet);

  // Speak welcome message on page load
  setTimeout(() => {
    speakFeedback(
      "Sign up page loaded. Create a four word passkey for your account. Double tap the quit hint at bottom left to exit."
    );
  }, 1000);

  // Provide guidance when focusing on passkey inputs
  const passkeyInputs = document.querySelectorAll(".passkey-input input");
  passkeyInputs.forEach((input, index) => {
    input.addEventListener("focus", function () {
      if (index === 0) {
        speakFeedback(
          "Enter your four word passkey. Example: correct horse battery staple"
        );
      } else {
        speakFeedback("Repeat your four word passkey to confirm");
      }
    });

    input.addEventListener("input", function () {
      const wordCount = this.value
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length;

      if (wordCount === 4) {
        speakFeedback("Four words entered. Good passkey length");
      }
    });
  });
}

// 5. ADDITIONAL ENHANCEMENTS

// Auto-focus first input on page load
setTimeout(() => {
  const firstInput = document.querySelector(".passkey-input input");
  if (firstInput) {
    firstInput.focus();
  }
}, 500);

// Add keyboard shortcuts
document.addEventListener("keydown", function (e) {
  // Ctrl/Cmd + Enter to submit form
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    const welcomeBtn = document.querySelector(".welcome-btn");
    if (welcomeBtn) {
      e.preventDefault();
      welcomeBtn.click();
    }
  }

  // Escape key focuses quit hint
  if (e.key === "Escape") {
    const quitHint = document.querySelector(".quit-hint");
    if (quitHint) {
      e.preventDefault();
      quitHint.focus();
      speakFeedback(
        "Quit hint focused. Double tap or press Enter twice to quit"
      );
    }
  }
});

// Password visibility toggle (optional enhancement)
function addPasswordToggle() {
  const passkeyInputs = document.querySelectorAll(".passkey-input");

  passkeyInputs.forEach((container) => {
    const input = container.querySelector("input");
    const icon = container.querySelector(".fa-lock");

    if (input && icon) {
      // Change lock icon to eye when typing
      input.addEventListener("input", function () {
        if (this.value.length > 0) {
          icon.className = "fas fa-eye";
          icon.setAttribute("aria-label", "Show passkey");

          // Add click to toggle visibility
          icon.style.cursor = "pointer";
          icon.addEventListener("click", function () {
            if (input.type === "password") {
              input.type = "text";
              this.className = "fas fa-eye-slash";
              this.setAttribute("aria-label", "Hide passkey");
              speakFeedback("Passkey shown");
            } else {
              input.type = "password";
              this.className = "fas fa-eye";
              this.setAttribute("aria-label", "Show passkey");
              speakFeedback("Passkey hidden");
            }
          });
        } else {
          icon.className = "fas fa-lock";
          icon.setAttribute("aria-label", "Passkey locked");
        }
      });
    }
  });
}

// Initialize password toggle (optional - uncomment if desired)
// addPasswordToggle();

// Network status indicator
function initNetworkStatus() {
  const connectionStatus = document.getElementById("connectionStatus");
  if (connectionStatus) {
    const updateNetworkStatus = () => {
      if (navigator.onLine) {
        connectionStatus.innerHTML = '<i class="fas fa-wifi"></i> Online';
        connectionStatus.style.background = "rgba(76, 175, 80, 0.2)";
      } else {
        connectionStatus.innerHTML =
          '<i class="fas fa-wifi-slash"></i> Offline';
        connectionStatus.style.background = "rgba(255, 82, 82, 0.2)";
        speakFeedback("You are offline. Some features may not work.");
      }
    };

    updateNetworkStatus();
    window.addEventListener("online", updateNetworkStatus);
    window.addEventListener("offline", updateNetworkStatus);
  }
}

// Initialize network status
initNetworkStatus();

console.log("Signup page features initialized successfully");

// signup.html JavaScript inclusion

// Signin Page JavaScript
document.addEventListener("DOMContentLoaded", function () {
  console.log("Signin page loaded");

  // Initialize features
  initDoubleTapQuit();
  initSigninValidation();
  initAccessibilityFeatures();
  initVoiceGuidance();
  initNetworkStatus();

  // Auto-focus the passkey input
  setTimeout(() => {
    const passkeyInput = document.querySelector(".passkey-input input");
    if (passkeyInput) {
      passkeyInput.focus();
      speakFeedback(
        "Sign in page. Enter your four word passkey or use voice input. Double tap the quit hint at bottom left to exit."
      );
    }
  }, 800);
});

// 1. DOUBLE TAP TO QUIT FEATURE (Signin version)
function initDoubleTapQuit() {
  const quitHint = document.querySelector(".quit-hint");
  if (!quitHint) return;

  let tapCount = 0;
  let lastTapTime = 0;
  let tapTimeout = null;
  const DOUBLE_TAP_DELAY = 300; // 300ms for double tap

  // Make quit hint interactive
  quitHint.style.pointerEvents = "auto";
  quitHint.style.cursor = "pointer";
  quitHint.setAttribute("role", "button");
  quitHint.setAttribute("tabindex", "0");
  quitHint.setAttribute(
    "aria-label",
    "Double tap or double press Enter to quit sign in"
  );

  // Add visual styles for interactive state
  quitHint.style.transition = "all 0.3s ease";
  quitHint.style.userSelect = "none";

  // Add focus styles
  quitHint.addEventListener("focus", function () {
    this.style.outline = "2px solid #9db8ff";
    this.style.outlineOffset = "4px";
    this.style.borderRadius = "4px";
  });

  quitHint.addEventListener("blur", function () {
    this.style.outline = "none";
  });

  // Speak instruction when focused
  quitHint.addEventListener("focus", function () {
    speakFeedback("Double tap or press Enter twice to quit sign in");
  });

  // Hover effect
  quitHint.addEventListener("mouseenter", function () {
    quitHint.style.color = "#ffffff";
    quitHint.style.transform = "scale(1.05)";
  });

  quitHint.addEventListener("mouseleave", function () {
    quitHint.style.color = "rgba(157, 184, 255, 0.8)";
    quitHint.style.transform = "scale(1)";
  });

  // Click/Touch handler
  quitHint.addEventListener("click", function (e) {
    e.preventDefault();
    handleQuitInteraction();
  });

  // Keyboard handler
  quitHint.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleQuitInteraction();
    }
  });

  function handleQuitInteraction() {
    const currentTime = new Date().getTime();
    const timeSinceLastTap = currentTime - lastTapTime;

    // Clear previous timeout
    if (tapTimeout) {
      clearTimeout(tapTimeout);
    }

    // First tap
    if (tapCount === 0) {
      tapCount = 1;
      lastTapTime = currentTime;

      // Visual feedback for first tap
      quitHint.classList.add("first-tap");
      speakFeedback("Tap again to confirm quit");

      // Reset after delay
      tapTimeout = setTimeout(() => {
        resetQuitTap();
        speakFeedback("Tap timed out. Please try again");
      }, DOUBLE_TAP_DELAY);
    }
    // Second tap within time limit
    else if (tapCount === 1 && timeSinceLastTap < DOUBLE_TAP_DELAY) {
      tapCount = 2;
      clearTimeout(tapTimeout);

      // Execute quit action
      executeQuit();
    }
  }

  function resetQuitTap() {
    tapCount = 0;
    lastTapTime = 0;
    tapTimeout = null;
    quitHint.classList.remove("first-tap", "second-tap");
  }

  function executeQuit() {
    // Visual feedback
    quitHint.classList.add("second-tap");
    speakFeedback("Quitting sign in...");

    // Show quitting animation
    const originalText = quitHint.textContent;
    quitHint.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Quitting...';
    quitHint.style.fontWeight = "bold";

    // Simulate quit action
    setTimeout(() => {
      speakFeedback("Sign in cancelled");

      // Navigate back or to home
      if (window.history.length > 1) {
        window.history.back();
      } else {
        // Optional: Redirect to home page
        // window.location.href = 'index.html';

        // Reset the hint
        setTimeout(() => {
          quitHint.innerHTML = originalText;
          quitHint.style.fontWeight = "normal";
          resetQuitTap();
        }, 1000);
      }
    }, 1000);
  }

  // Add CSS for tap states
  const tapStyles = `
        .quit-hint.first-tap {
            color: #ff9800 !important;
            font-weight: bold;
            animation: pulse 0.3s ease;
        }
        
        .quit-hint.second-tap {
            color: #ff5252 !important;
            font-weight: bold;
            animation: pulse 0.5s ease;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        
        .fa-spinner {
            margin-right: 8px;
        }
    `;

  const styleSheet = document.createElement("style");
  styleSheet.textContent = tapStyles;
  document.head.appendChild(styleSheet);
}

// 2. SIGNIN VALIDATION
function initSigninValidation() {
  const passkeyInput = document.querySelector(".passkey-input input");
  const welcomeBtn = document.querySelector(".welcome-btn");

  if (!passkeyInput || !welcomeBtn) return;

  // Word count validation
  passkeyInput.addEventListener("input", function () {
    validatePasskey(this);
  });

  // Form submission handler
  welcomeBtn.addEventListener("click", function (e) {
    if (!validateSigninForm()) {
      e.preventDefault();
      speakFeedback("Please enter a valid four word passkey");
    } else {
      // Simulate signin process
      simulateSignin();
    }
  });

  function validatePasskey(input) {
    const value = input.value.trim();
    const wordCount = value
      .split(/\s+/)
      .filter((word) => word.length > 0).length;

    // Clear previous error
    clearPasskeyError(input);

    if (value && wordCount !== 4) {
      showPasskeyError(input, "Passkey must be exactly 4 words");
      return false;
    }

    return true;
  }

  function showPasskeyError(inputElement, message) {
    // Add error class to parent
    const parentDiv = inputElement.closest(".passkey-input");
    if (parentDiv) {
      parentDiv.classList.add("error");
    }

    // Create error message
    const errorElement = document.createElement("div");
    errorElement.className = "passkey-error";
    errorElement.textContent = message;
    errorElement.style.color = "#ff5252";
    errorElement.style.fontSize = "12px";
    errorElement.style.marginTop = "5px";
    errorElement.style.textAlign = "center";

    // Insert after the input container
    const form = inputElement.closest(".passkey-form");
    if (form) {
      // Remove existing error
      const existingError = form.querySelector(".passkey-error");
      if (existingError) {
        existingError.remove();
      }
      form.appendChild(errorElement);
    }

    // Speak error for accessibility
    speakFeedback(message);
  }

  function clearPasskeyError(inputElement) {
    const parentDiv = inputElement.closest(".passkey-input");
    if (parentDiv) {
      parentDiv.classList.remove("error");
    }

    // Remove error message
    const form = inputElement.closest(".passkey-form");
    if (form) {
      const errorElement = form.querySelector(".passkey-error");
      if (errorElement) {
        errorElement.remove();
      }
    }
  }

  function validateSigninForm() {
    const passkeyInput = document.querySelector(".passkey-input input");
    const value = passkeyInput.value.trim();

    // Check if field is empty
    if (!value) {
      speakFeedback("Please enter your passkey");
      return false;
    }

    // Check word count
    const wordCount = value
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    if (wordCount !== 4) {
      speakFeedback("Passkey must be exactly 4 words");
      return false;
    }

    return true;
  }

  function simulateSignin() {
    const welcomeBtn = document.querySelector(".welcome-btn");
    const passkeyInput = document.querySelector(".passkey-input input");

    if (!welcomeBtn || !passkeyInput) return;

    // Store original state
    const originalText = welcomeBtn.innerHTML;
    const passkeyValue = passkeyInput.value;

    // Show loading state
    welcomeBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Signing in...';
    welcomeBtn.disabled = true;
    passkeyInput.disabled = true;

    speakFeedback("Signing in... Please wait");

    // Simulate authentication process
    setTimeout(() => {
      // In a real app, this would be an API call
      const isAuthenticated = simulateAuthentication(passkeyValue);

      if (isAuthenticated) {
        // Success
        welcomeBtn.innerHTML = '<i class="fas fa-check"></i> Success!';
        welcomeBtn.style.background = "#4caf50";
        speakFeedback("Sign in successful! Redirecting...");

        // Redirect after delay
        setTimeout(() => {
          window.location.href = "home.html"; // Change to your actual home page
        }, 1500);
      } else {
        // Failure
        welcomeBtn.innerHTML = "Try Again";
        welcomeBtn.style.background = "#ff5252";
        passkeyInput.disabled = false;
        passkeyInput.focus();

        speakFeedback("Invalid passkey. Please try again", "assertive");

        // Reset button after delay
        setTimeout(() => {
          welcomeBtn.innerHTML = originalText;
          welcomeBtn.disabled = false;
          welcomeBtn.style.background = "";
        }, 2000);
      }
    }, 2000);
  }

  function simulateAuthentication(passkey) {
    // This is a simulation - in a real app, you would check against a database
    // For demo purposes, accept any 4-word passkey
    const wordCount = passkey
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    return wordCount === 4;
  }

  // Add CSS for validation
  const validationStyles = `
        .passkey-input.error {
            border-color: #ff5252 !important;
            animation: shake 0.5s ease-in-out;
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .passkey-error {
            color: #ff5252;
            font-size: 12px;
            margin-top: 5px;
            text-align: center;
            max-width: 260px;
            margin-left: auto;
            margin-right: auto;
        }
    `;

  const styleSheet = document.createElement("style");
  styleSheet.textContent = validationStyles;
  document.head.appendChild(styleSheet);
}

// 3. ACCESSIBILITY ENHANCEMENTS
function initAccessibilityFeatures() {
  // Add skip to content link
  if (!document.querySelector(".skip-link")) {
    const skipLink = document.createElement("a");
    skipLink.href = "#main-content";
    skipLink.className = "skip-link";
    skipLink.textContent = "Skip to main content";
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add main content id
    const mainContent = document.querySelector(".passkey-form")?.parentElement;
    if (mainContent) {
      mainContent.id = "main-content";
    }
  }

  // Enhance welcome button
  const welcomeBtn = document.querySelector(".welcome-btn");
  if (welcomeBtn) {
    welcomeBtn.setAttribute("aria-label", "Sign in with passkey");

    // Add Enter key support for the form
    const form = document.querySelector(".passkey-form");
    if (form) {
      form.addEventListener("keydown", function (e) {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          welcomeBtn.click();
        }
      });
    }
  }

  // Enhance forgot password link
  const forgotPasswordLink = document.querySelector(".forgot-password");
  if (forgotPasswordLink) {
    forgotPasswordLink.setAttribute(
      "aria-label",
      "Forgot password? Reset your passkey"
    );

    // Add keyboard navigation
    forgotPasswordLink.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        this.click();
      }
    });
  }

  // Add focus management for inputs
  const inputs = document.querySelectorAll("input");
  inputs.forEach((input) => {
    input.addEventListener("focus", function () {
      this.style.outline = "2px solid #9db8ff";
      this.style.outlineOffset = "2px";
    });

    input.addEventListener("blur", function () {
      this.style.outline = "none";
    });
  });

  // CSS for skip link
  const skipLinkStyles = `
        .skip-link {
            position: absolute;
            top: -40px;
            left: 0;
            background: #9db8ff;
            color: #2d2c2e;
            padding: 8px 16px;
            text-decoration: none;
            font-weight: bold;
            border-radius: 0 0 8px 0;
            z-index: 1000;
        }
        
        .skip-link:focus {
            top: 0;
        }
    `;

  const styleSheet = document.createElement("style");
  styleSheet.textContent = skipLinkStyles;
  document.head.appendChild(styleSheet);
}

// 4. VOICE GUIDANCE SYSTEM
function initVoiceGuidance() {
  // Create status message element
  let statusMessage = document.getElementById("voiceStatus");
  if (!statusMessage) {
    statusMessage = document.createElement("div");
    statusMessage.id = "voiceStatus";
    statusMessage.className = "voice-status-message";
    statusMessage.setAttribute("aria-live", "polite");
    statusMessage.setAttribute("role", "status");
    document.body.appendChild(statusMessage);
  }

  // Global speak function
  window.speakFeedback = function (message, priority = "polite") {
    console.log("Voice feedback:", message);

    // Update ARIA live region
    statusMessage.setAttribute("aria-live", priority);
    statusMessage.textContent = message;
    statusMessage.classList.add("show");

    // Hide after delay
    setTimeout(
      () => {
        statusMessage.classList.remove("show");
      },
      priority === "assertive" ? 5000 : 3000
    );

    // Optional: Use Web Speech API
    // speakWithTTS(message);
  };

  // Optional TTS function
  function speakWithTTS(text) {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        utterance.voice =
          voices.find((voice) => voice.lang.startsWith("en")) || voices[0];
      }

      speechSynthesis.speak(utterance);
    }
  }

  // Provide guidance for passkey input
  const passkeyInput = document.querySelector(".passkey-input input");
  if (passkeyInput) {
    passkeyInput.addEventListener("focus", function () {
      speakFeedback("Enter your four word passkey or use voice input");
    });

    passkeyInput.addEventListener("input", function () {
      const wordCount = this.value
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length;

      if (wordCount === 1) {
        speakFeedback("One word entered");
      } else if (wordCount === 2) {
        speakFeedback("Two words entered");
      } else if (wordCount === 3) {
        speakFeedback("Three words entered");
      } else if (wordCount === 4) {
        speakFeedback("Four words entered. Ready to sign in");
      }
    });
  }

  // CSS for voice status
  const voiceStyles = `
        .voice-status-message {
            position: fixed;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%) translateY(20px);
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s, transform 0.3s;
            pointer-events: none;
            max-width: 80%;
            text-align: center;
            border: 2px solid #9db8ff;
        }
        
        .voice-status-message.show {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    `;

  const styleSheet = document.createElement("style");
  styleSheet.textContent = voiceStyles;
  document.head.appendChild(styleSheet);
}

// 5. NETWORK STATUS INDICATOR
function initNetworkStatus() {
  // Create network status indicator if not exists
  let networkStatus = document.getElementById("networkStatus");
  if (!networkStatus) {
    networkStatus = document.createElement("div");
    networkStatus.id = "networkStatus";
    networkStatus.className = "network-status";
    networkStatus.style.position = "fixed";
    networkStatus.style.top = "10px";
    networkStatus.style.right = "10px";
    networkStatus.style.padding = "6px 12px";
    networkStatus.style.borderRadius = "12px";
    networkStatus.style.fontSize = "12px";
    networkStatus.style.zIndex = "1000";
    document.body.appendChild(networkStatus);
  }

  const updateNetworkStatus = () => {
    if (navigator.onLine) {
      networkStatus.innerHTML = '<i class="fas fa-wifi"></i> Online';
      networkStatus.style.background = "rgba(76, 175, 80, 0.2)";
      networkStatus.style.color = "#4caf50";
    } else {
      networkStatus.innerHTML = '<i class="fas fa-wifi-slash"></i> Offline';
      networkStatus.style.background = "rgba(255, 82, 82, 0.2)";
      networkStatus.style.color = "#ff5252";
      speakFeedback("You are offline. Sign in may not work.", "assertive");
    }
  };

  updateNetworkStatus();
  window.addEventListener("online", updateNetworkStatus);
  window.addEventListener("offline", updateNetworkStatus);
}

// 6. ADDITIONAL FEATURES

// Keyboard shortcuts
document.addEventListener("keydown", function (e) {
  // Ctrl/Cmd + Enter to submit
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    const welcomeBtn = document.querySelector(".welcome-btn");
    if (welcomeBtn) {
      e.preventDefault();
      welcomeBtn.click();
    }
  }

  // Escape key focuses quit hint
  if (e.key === "Escape") {
    const quitHint = document.querySelector(".quit-hint");
    if (quitHint) {
      e.preventDefault();
      quitHint.focus();
      speakFeedback(
        "Quit hint focused. Double tap or press Enter twice to quit"
      );
    }
  }

  // Tab navigation for passkey visibility toggle
  if (e.key === "Tab" && !e.shiftKey) {
    const passkeyInput = document.querySelector(".passkey-input input");
    if (document.activeElement === passkeyInput) {
      // Add password visibility toggle hint
      setTimeout(() => {
        speakFeedback("Press V to toggle password visibility");
      }, 100);
    }
  }
});

// Password visibility toggle
document.addEventListener("keydown", function (e) {
  if (e.key === "v" || e.key === "V") {
    const passkeyInput = document.querySelector(".passkey-input input");
    if (document.activeElement === passkeyInput) {
      togglePasswordVisibility(passkeyInput);
    }
  }
});

function togglePasswordVisibility(input) {
  if (input.type === "password") {
    input.type = "text";
    speakFeedback("Password shown");

    // Change icon if exists
    const icon = input.parentElement.querySelector("i");
    if (icon) {
      icon.className = "fas fa-eye-slash";
      icon.setAttribute("aria-label", "Hide passkey");
    }

    // Auto-hide after 5 seconds
    setTimeout(() => {
      if (input.type === "text") {
        input.type = "password";
        speakFeedback("Password hidden");
        if (icon) {
          icon.className = "fas fa-eye";
          icon.setAttribute("aria-label", "Show passkey");
        }
      }
    }, 5000);
  } else {
    input.type = "password";
    speakFeedback("Password hidden");

    const icon = input.parentElement.querySelector("i");
    if (icon) {
      icon.className = "fas fa-eye";
      icon.setAttribute("aria-label", "Show passkey");
    }
  }
}

// Voice input simulation (optional)
function initVoiceInput() {
  const passkeyInput = document.querySelector(".passkey-input input");
  if (!passkeyInput) return;

  // Add voice input button
  const voiceBtn = document.createElement("button");
  voiceBtn.className = "voice-input-btn";
  voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
  voiceBtn.setAttribute("aria-label", "Voice input");
  voiceBtn.style.background = "none";
  voiceBtn.style.border = "none";
  voiceBtn.style.color = "#9db8ff";
  voiceBtn.style.cursor = "pointer";
  voiceBtn.style.fontSize = "16px";
  voiceBtn.style.marginLeft = "8px";

  // Insert after input
  const inputContainer = passkeyInput.parentElement;
  inputContainer.appendChild(voiceBtn);

  voiceBtn.addEventListener("click", function (e) {
    e.preventDefault();
    simulateVoiceInput();
  });

  function simulateVoiceInput() {
    speakFeedback("Voice input activated. Please speak your passkey now");

    // Simulate listening
    voiceBtn.innerHTML = '<i class="fas fa-microphone-slash"></i>';
    voiceBtn.style.color = "#ff9800";

    // Simulate voice recognition
    setTimeout(() => {
      // Demo passkey
      const demoPasskey = "correct horse battery staple";
      passkeyInput.value = demoPasskey;
      passkeyInput.dispatchEvent(new Event("input"));

      speakFeedback(`Passkey recognized: ${demoPasskey}`);

      // Reset button
      voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
      voiceBtn.style.color = "#9db8ff";
    }, 2000);
  }
}

// Initialize voice input (optional - uncomment if desired)
// initVoiceInput();

console.log("Signin page features initialized successfully");
