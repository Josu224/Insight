// Home Page Extra Features - Double Tap to Quit & Accessibility Enhancements
// This file works alongside your existing home.js without conflicts

(function () {
  "use strict";

  console.log("Home page extra features loading...");

  // Wait for DOM to be fully loaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHomeExtras);
  } else {
    initHomeExtras();
  }

  function initHomeExtras() {
    console.log("Initializing home page extra features");

    // Add double tap to quit feature
    addDoubleTapQuit();

    // Add accessibility enhancements
    enhanceAccessibility();

    // Add voice guidance
    addVoiceGuidance();

    // Add network status indicator
    addNetworkStatus();

    // Add keyboard shortcuts
    addKeyboardShortcuts();

    console.log("Home page extra features initialized");
  }

  // 1. DOUBLE TAP TO QUIT FEATURE
  function addDoubleTapQuit() {
    const declineElement = document.querySelector(".decline");
    if (!declineElement) {
      console.warn("Decline element not found");
      return;
    }

    let tapCount = 0;
    let lastTapTime = 0;
    let tapTimeout = null;
    const DOUBLE_TAP_DELAY = 300; // 300ms for double tap
    let isQuitting = false;

    // Make decline element interactive
    declineElement.style.pointerEvents = "auto";
    declineElement.style.cursor = "pointer";
    declineElement.setAttribute("role", "button");
    declineElement.setAttribute("tabindex", "0");
    declineElement.setAttribute(
      "aria-label",
      "Double tap or press Enter twice to quit the application. Tap once to hear instructions."
    );

    // Add focus styles
    declineElement.addEventListener("focus", function () {
      this.style.outline = "2px solid #9db8ff";
      this.style.outlineOffset = "4px";
      this.style.borderRadius = "4px";
    });

    declineElement.addEventListener("blur", function () {
      this.style.outline = "none";
    });

    // Speak instruction when focused
    declineElement.addEventListener("focus", function () {
      speakFeedback(
        "Double tap or press Enter twice to quit. Tap once to hear this message again."
      );
    });

    // Hover effect
    declineElement.addEventListener("mouseenter", function () {
      this.style.color = "#ffffff";
      this.style.transform = "scale(1.05)";
      this.style.transition = "all 0.3s ease";
    });

    declineElement.addEventListener("mouseleave", function () {
      this.style.color = "#9db8ff";
      this.style.transform = "scale(1)";
    });

    // Click/Touch handler
    declineElement.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      handleQuitInteraction();
    });

    // Keyboard handler
    declineElement.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        e.stopPropagation();
        handleQuitInteraction();
      }
    });

    function handleQuitInteraction() {
      if (isQuitting) return;

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
        declineElement.classList.add("first-tap");
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
      declineElement.classList.remove("first-tap", "second-tap", "quitting");
    }

    function executeQuit() {
      isQuitting = true;

      // Visual feedback
      declineElement.classList.add("second-tap", "quitting");
      speakFeedback("Quitting application...");

      // Show quitting animation
      const originalHTML = declineElement.innerHTML;
      declineElement.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> Quitting...';

      // Stop any ongoing speech recognition
      stopSpeechRecognition();

      // Simulate quit action
      setTimeout(() => {
        speakFeedback("Application closed. Goodbye!");

        // In a real app, you might:
        // 1. Close the PWA
        // 2. Navigate to exit page
        // 3. Show confirmation

        // For demo, just reset after showing success
        setTimeout(() => {
          declineElement.innerHTML = originalHTML;
          isQuitting = false;
          resetQuitTap();

          // Optional: Actually quit by redirecting
          // window.location.href = 'about:blank';
        }, 1500);
      }, 1000);
    }

    function stopSpeechRecognition() {
      // Try to stop the existing speech recognition
      try {
        const voiceBtn = document.getElementById("voiceBtn");
        if (voiceBtn && voiceBtn.classList.contains("recording")) {
          // Trigger mouseup to stop recording
          voiceBtn.dispatchEvent(new Event("mouseup"));
          voiceBtn.dispatchEvent(new Event("touchend"));
        }
      } catch (e) {
        console.log("Could not stop speech recognition:", e);
      }
    }

    // Add CSS for tap states
    const tapStyles = `
            .decline.first-tap {
                color: #ff9800 !important;
                font-weight: bold;
                animation: pulse 0.3s ease;
                background: rgba(255, 152, 0, 0.1);
            }
            
            .decline.second-tap {
                color: #ff5252 !important;
                font-weight: bold;
                animation: pulse 0.5s ease;
                background: rgba(255, 82, 82, 0.1);
            }
            
            .decline.quitting {
                background: rgba(255, 82, 82, 0.2);
            }
            
            .fa-spinner {
                margin-right: 8px;
                animation: spin 1s linear infinite;
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;

    injectStyles(tapStyles);
  }

  // 2. ACCESSIBILITY ENHANCEMENTS
  function enhanceAccessibility() {
    // Add skip to content link
    if (!document.querySelector(".skip-link")) {
      const skipLink = document.createElement("a");
      skipLink.href = "#main-content";
      skipLink.className = "skip-link";
      skipLink.textContent = "Skip to main content";
      skipLink.style.cssText = `
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
            `;

      skipLink.addEventListener("focus", function () {
        this.style.top = "0";
      });

      skipLink.addEventListener("blur", function () {
        this.style.top = "-40px";
      });

      document.body.insertBefore(skipLink, document.body.firstChild);

      // Add main content id
      const mainContent = document.querySelector(".main");
      if (mainContent) {
        mainContent.id = "main-content";
        mainContent.setAttribute("tabindex", "-1");
      }
    }

    // Enhance action buttons with better labels
    const actionButtons = document.querySelectorAll(".action-btn");
    actionButtons.forEach((btn, index) => {
      const span = btn.querySelector("span");
      if (span) {
        const actionName = span.textContent;
        btn.setAttribute(
          "aria-label",
          `${actionName} button. Click or say "${actionName}" to open.`
        );

        // Add role if not present
        if (!btn.getAttribute("role")) {
          btn.setAttribute("role", "button");
        }
      }

      // Add keyboard navigation
      btn.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.click();
        }
      });
    });

    // Add focus management for record button
    const recordBtn = document.getElementById("voiceBtn");
    if (recordBtn) {
      recordBtn.setAttribute(
        "aria-label",
        "Hold to record audio command. Release to stop."
      );

      // Add keyboard support for testing
      recordBtn.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          simulateVoiceCommand();
        }
      });
    }
  }

  // 3. VOICE GUIDANCE SYSTEM
  function addVoiceGuidance() {
    // Create status message element
    let voiceStatus = document.getElementById("voiceStatus");
    if (!voiceStatus) {
      voiceStatus = document.getElementById("voiceStatus");
    }

    // Global speak function
    window.speakFeedback = function (message, priority = "polite") {
      console.log("Voice feedback:", message);

      // Create or update status message
      let statusMsg = document.getElementById("accessibilityStatus");
      if (!statusMsg) {
        statusMsg = document.createElement("div");
        statusMsg.id = "accessibilityStatus";
        statusMsg.className = "accessibility-status";
        statusMsg.setAttribute("aria-live", priority);
        statusMsg.setAttribute("role", "status");
        document.body.appendChild(statusMsg);
      }

      statusMsg.textContent = message;
      statusMsg.classList.add("show");

      // Hide after delay
      setTimeout(
        () => {
          statusMsg.classList.remove("show");
        },
        priority === "assertive" ? 5000 : 3000
      );

      // Optional: Use Web Speech API
      // speakWithTTS(message);
    };

    // Speak welcome message
    setTimeout(() => {
      speakFeedback(
        'Home page loaded. Use voice commands or buttons to navigate. Say "navigate", "assistant", "call", "settings", "detect", or "translate". Double tap bottom left to quit.'
      );
    }, 1000);

    // Add focus guidance for buttons
    const buttons = document.querySelectorAll("button");
    buttons.forEach((btn) => {
      btn.addEventListener("focus", function () {
        const label = this.getAttribute("aria-label") || this.textContent;
        speakFeedback(`Focused on ${label}`);
      });
    });

    // Add CSS for status messages
    const statusStyles = `
            .accessibility-status {
                position: fixed;
                bottom: 100px;
                left: 50%;
                transform: translateX(-50%) translateY(20px);
                background: rgba(0, 0, 0, 0.95);
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
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
            }
            
            .accessibility-status.show {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        `;

    injectStyles(statusStyles);
  }

  // 4. NETWORK STATUS INDICATOR
  function addNetworkStatus() {
    // Create network status element
    const networkStatus = document.createElement("div");
    networkStatus.id = "homeNetworkStatus";
    networkStatus.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            padding: 6px 12px;
            border-radius: 12px;
            font-size: 12px;
            z-index: 1000;
            background: rgba(76, 175, 80, 0.2);
            color: #4caf50;
            display: flex;
            align-items: center;
            gap: 6px;
        `;

    const updateNetworkStatus = () => {
      if (navigator.onLine) {
        networkStatus.innerHTML = '<i class="fas fa-wifi"></i> Online';
        networkStatus.style.background = "rgba(76, 175, 80, 0.2)";
        networkStatus.style.color = "#4caf50";
      } else {
        networkStatus.innerHTML = '<i class="fas fa-wifi-slash"></i> Offline';
        networkStatus.style.background = "rgba(255, 82, 82, 0.2)";
        networkStatus.style.color = "#ff5252";
        speakFeedback(
          "You are offline. Some features may not work.",
          "assertive"
        );
      }
    };

    updateNetworkStatus();
    networkStatus.innerHTML = '<i class="fas fa-wifi"></i> Online';
    document.body.appendChild(networkStatus);

    // Update on network changes
    window.addEventListener("online", updateNetworkStatus);
    window.addEventListener("offline", updateNetworkStatus);
  }

  // 5. KEYBOARD SHORTCUTS
  function addKeyboardShortcuts() {
    document.addEventListener("keydown", function (e) {
      // Escape key focuses quit hint
      if (e.key === "Escape") {
        const declineElement = document.querySelector(".decline");
        if (declineElement) {
          e.preventDefault();
          declineElement.focus();
          speakFeedback(
            "Quit hint focused. Double tap or press Enter twice to quit."
          );
        }
      }

      // Number keys for quick navigation (1-6 for action buttons)
      if (e.key >= "1" && e.key <= "6" && !e.ctrlKey && !e.altKey) {
        const index = parseInt(e.key) - 1;
        const actionButtons = document.querySelectorAll(".action-btn");
        if (actionButtons[index]) {
          e.preventDefault();
          actionButtons[index].focus();
          const buttonName =
            actionButtons[index].querySelector("span")?.textContent ||
            `Button ${e.key}`;
          speakFeedback(`${buttonName}. Press Enter to activate.`);
        }
      }

      // V key for voice command simulation
      if (e.key === "v" || e.key === "V") {
        const recordBtn = document.getElementById("voiceBtn");
        if (document.activeElement === recordBtn) {
          e.preventDefault();
          simulateVoiceCommand();
        }
      }

      // H key for help
      if (e.key === "h" || e.key === "H") {
        e.preventDefault();
        speakFeedback(
          "Keyboard shortcuts: 1-6 for buttons, V for voice simulation, Escape for quit, H for this help."
        );
      }
    });
  }

  // HELPER FUNCTIONS

  function simulateVoiceCommand() {
    const recordBtn = document.getElementById("voiceBtn");
    const voiceStatus = document.getElementById("voiceStatus");

    if (!recordBtn || !voiceStatus) return;

    // Simulate recording start
    recordBtn.classList.add("recording");
    const originalStatus = voiceStatus.textContent;
    voiceStatus.textContent = "Listening...";

    speakFeedback(
      'Voice simulation activated. Say a command like "navigate" or "settings".'
    );

    // Simulate command recognition after delay
    setTimeout(() => {
      // Demo: simulate "settings" command
      const simulatedCommand = "settings";

      speakFeedback(`Recognized: ${simulatedCommand}. Opening settings...`);

      // Reset UI
      recordBtn.classList.remove("recording");
      voiceStatus.textContent = originalStatus;

      // Optional: Actually navigate
      // window.location.href = 'settings.html';
    }, 2000);
  }

  function injectStyles(css) {
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
  }

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
})();
