// UNIFIED BACK-TO-HOME BUTTON SYSTEM
// Include this script on ALL pages for consistent back button behavior

(function () {
  "use strict";

  console.log("Unified back button system loading...");

  // Wait for DOM
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initBackButtonSystem);
  } else {
    initBackButtonSystem();
  }

  function initBackButtonSystem() {
    console.log("Initializing unified back button system");

    // 1. Create or update back button on each page
    setupBackButton();

    // 2. Add keyboard shortcuts
    setupKeyboardShortcuts();

    // 3. Add voice guidance
    setupVoiceGuidance();

    console.log("Back button system initialized");
  }

  function setupBackButton() {
    // Find existing back button or create new one
    let backButton = document.querySelector(
      "[data-back-to-home], .back-to-home, #homeLink, .home-link, .back-home"
    );

    if (!backButton) {
      // Create new button if none exists
      backButton = createBackButton();
    } else {
      // Standardize existing button
      standardizeBackButton(backButton);
    }

    // Add event listeners
    addBackButtonListeners(backButton);

    // Add entrance animation
    setTimeout(() => {
      backButton.classList.add("page-entrance");
    }, 300);

    // Pulse animation after 3 seconds to indicate its presence
    setTimeout(() => {
      backButton.classList.add("pulse");
      setTimeout(() => {
        backButton.classList.remove("pulse");
      }, 3000);
    }, 3000);
  }

  function createBackButton() {
    const backButton = document.createElement("a");
    backButton.href = "home.html";
    backButton.className = "back-to-home";
    backButton.setAttribute("role", "button");
    backButton.setAttribute("aria-label", "Back to home page");
    backButton.setAttribute("data-back-to-home", "true");
    backButton.tabIndex = 0;

    // Add icon and text
    backButton.innerHTML = `
            <i class="fas fa-home" aria-hidden="true"></i>
            <span>Back to Home</span>
            <span class="sr-only">Button to return to the home page</span>
        `;

    // Add to page (bottom left)
    document.body.appendChild(backButton);

    return backButton;
  }

  function standardizeBackButton(element) {
    // Standardize class
    element.className = "back-to-home";

    // Ensure it's a link/button
    if (
      element.tagName === "P" ||
      element.tagName === "SPAN" ||
      element.tagName === "DIV"
    ) {
      const newElement = document.createElement("a");
      newElement.href = "home.html";
      newElement.className = "back-to-home";
      newElement.innerHTML = element.innerHTML;

      // Copy all attributes
      Array.from(element.attributes).forEach((attr) => {
        if (attr.name !== "class") {
          newElement.setAttribute(attr.name, attr.value);
        }
      });

      element.parentNode.replaceChild(newElement, element);
      return newElement;
    }

    // Ensure href if it's an anchor
    if (element.tagName === "A" && !element.getAttribute("href")) {
      element.href = "home.html";
    }

    // Ensure proper attributes
    if (!element.getAttribute("role")) {
      element.setAttribute("role", "button");
    }

    if (!element.getAttribute("aria-label")) {
      element.setAttribute("aria-label", "Back to home page");
    }

    if (!element.getAttribute("tabindex")) {
      element.tabIndex = 0;
    }

    // Add data attribute
    element.setAttribute("data-back-to-home", "true");

    // Add icon if missing
    if (!element.querySelector("i.fa-home")) {
      const icon = document.createElement("i");
      icon.className = "fas fa-home";
      icon.setAttribute("aria-hidden", "true");
      element.prepend(icon);

      // Add space
      element.innerHTML += " ";
    }

    return element;
  }

  function addBackButtonListeners(button) {
    // Remove any existing listeners first
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
    button = newButton;

    // Click handler
    button.addEventListener("click", function (e) {
      e.preventDefault();
      navigateToHome();
    });

    // Keyboard handler
    button.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        navigateToHome();
      }

      // Arrow key navigation
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
        speakFeedback("Use Tab to navigate to other elements");
      }
    });

    // Focus handler
    button.addEventListener("focus", function () {
      speakFeedback(
        "Back to home button. Press Enter to return to the main page."
      );
      this.classList.add("focused");
    });

    button.addEventListener("blur", function () {
      this.classList.remove("focused");
    });

    // Touch feedback
    let touchTimer;
    button.addEventListener("touchstart", function () {
      touchTimer = setTimeout(() => {
        speakFeedback("Back to home. Lift finger to activate.");
      }, 500);
    });

    button.addEventListener("touchend", function () {
      clearTimeout(touchTimer);
    });

    // Context menu (right click) - add more options
    button.addEventListener("contextmenu", function (e) {
      e.preventDefault();
      showBackButtonContextMenu(e, button);
    });
  }

  function navigateToHome() {
    const backButton = document.querySelector(".back-to-home");

    // Visual feedback
    if (backButton) {
      const originalHTML = backButton.innerHTML;
      backButton.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Going Home...';
      backButton.style.pointerEvents = "none";

      // Voice feedback
      speakFeedback("Returning to home page...", "assertive");

      // Show status message
      showStatusMessage("Navigating to home page...");
    }

    // Try multiple paths
    const homePaths = [
      "home.html",
      "../home.html",
      "/home.html",
      "/code/home.html",
      "index.html",
      "../index.html",
    ];

    // Find working path
    findWorkingPath(homePaths)
      .then((workingPath) => {
        setTimeout(() => {
          window.location.href = workingPath;
        }, 800); // Delay for feedback
      })
      .catch(() => {
        // Fallback
        speakFeedback(
          "Home page not found. Please check the link.",
          "assertive"
        );

        if (backButton) {
          backButton.innerHTML =
            '<i class="fas fa-exclamation-circle"></i> Error';
          setTimeout(() => {
            backButton.innerHTML = '<i class="fas fa-home"></i> Back to Home';
            backButton.style.pointerEvents = "auto";
          }, 2000);
        }
      });
  }

  function findWorkingPath(paths) {
    return new Promise((resolve, reject) => {
      let currentIndex = 0;

      function testNextPath() {
        if (currentIndex >= paths.length) {
          reject(new Error("No working path found"));
          return;
        }

        const path = paths[currentIndex];

        // Test if path exists
        fetch(path, { method: "HEAD", cache: "no-cache" })
          .then((response) => {
            if (response.ok) {
              resolve(path);
            } else {
              currentIndex++;
              setTimeout(testNextPath, 50);
            }
          })
          .catch(() => {
            currentIndex++;
            setTimeout(testNextPath, 50);
          });
      }

      testNextPath();
    });
  }

  function setupKeyboardShortcuts() {
    document.addEventListener("keydown", function (e) {
      // Alt + H to focus back button
      if (e.altKey && e.key === "h") {
        e.preventDefault();
        const backButton = document.querySelector(".back-to-home");
        if (backButton) {
          backButton.focus();
          speakFeedback(
            "Back to home button focused. Press Enter to activate."
          );
        }
      }

      // Escape key to go back (alternative)
      if (e.key === "Escape" && !e.ctrlKey && !e.altKey) {
        const activeElement = document.activeElement;
        if (!activeElement || activeElement.tagName === "BODY") {
          e.preventDefault();
          const backButton = document.querySelector(".back-to-home");
          if (backButton) {
            backButton.focus();
            speakFeedback(
              "Press Enter to go back to home, or Tab to continue."
            );
          }
        }
      }
    });
  }

  function setupVoiceGuidance() {
    // Page load announcement
    setTimeout(() => {
      const pageTitle = document.title || "Page";
      speakFeedback(`${pageTitle} loaded. Use Alt+H to focus back button.`);
    }, 1000);

    // Create status message element
    window.speakFeedback = function (message, priority = "polite") {
      console.log("Voice feedback:", message);

      let statusMsg = document.getElementById("backStatusMessage");
      if (!statusMsg) {
        statusMsg = document.createElement("div");
        statusMsg.id = "backStatusMessage";
        statusMsg.className = "back-status-message";
        statusMsg.setAttribute("aria-live", priority);
        statusMsg.setAttribute("role", "status");
        document.body.appendChild(statusMsg);
      }

      statusMsg.textContent = message;
      statusMsg.classList.add("show");

      setTimeout(
        () => {
          statusMsg.classList.remove("show");
        },
        priority === "assertive" ? 5000 : 3000
      );

      // Optional TTS
      // if ('speechSynthesis' in window && window.enableTTS) {
      //     const utterance = new SpeechSynthesisUtterance(message);
      //     utterance.rate = 0.9;
      //     speechSynthesis.speak(utterance);
      // }
    };

    window.showStatusMessage = function (message) {
      speakFeedback(message);
    };
  }

  function showBackButtonContextMenu(event, button) {
    // Remove any existing context menu
    const existingMenu = document.getElementById("backContextMenu");
    if (existingMenu) existingMenu.remove();

    // Create context menu
    const menu = document.createElement("div");
    menu.id = "backContextMenu";
    menu.className = "context-menu";
    menu.style.cssText = `
            position: fixed;
            top: ${event.clientY}px;
            left: ${event.clientX}px;
            background: rgba(60, 59, 62, 0.95);
            border: 1px solid #9db8ff;
            border-radius: 8px;
            padding: 8px 0;
            z-index: 10000;
            min-width: 180px;
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        `;

    menu.innerHTML = `
            <div class="menu-item" data-action="home" tabindex="0">
                <i class="fas fa-home"></i> Go Home
            </div>
            <div class="menu-item" data-action="reload" tabindex="0">
                <i class="fas fa-redo"></i> Reload Page
            </div>
            <div class="menu-item" data-action="back" tabindex="0">
                <i class="fas fa-arrow-left"></i> Go Back
            </div>
            <hr style="margin: 4px 0; border-color: #444;">
            <div class="menu-item" data-action="help" tabindex="0">
                <i class="fas fa-question-circle"></i> Help
            </div>
        `;

    document.body.appendChild(menu);

    // Style menu items
    const menuItems = menu.querySelectorAll(".menu-item");
    menuItems.forEach((item) => {
      item.style.cssText = `
                padding: 10px 16px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 10px;
                transition: background 0.2s;
                color: white;
            `;

      item.addEventListener("mouseenter", () => {
        item.style.background = "rgba(157, 184, 255, 0.2)";
      });

      item.addEventListener("mouseleave", () => {
        item.style.background = "";
      });

      item.addEventListener("click", (e) => {
        e.stopPropagation();
        handleContextMenuAction(item.getAttribute("data-action"));
        menu.remove();
      });

      item.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          handleContextMenuAction(item.getAttribute("data-action"));
          menu.remove();
        }
        if (e.key === "Escape") {
          menu.remove();
        }
      });
    });

    // Close menu when clicking elsewhere
    setTimeout(() => {
      const closeMenu = (e) => {
        if (!menu.contains(e.target)) {
          menu.remove();
          document.removeEventListener("click", closeMenu);
        }
      };
      document.addEventListener("click", closeMenu);
    }, 100);

    // Focus first item
    setTimeout(() => {
      menuItems[0].focus();
    }, 50);
  }

  function handleContextMenuAction(action) {
    switch (action) {
      case "home":
        navigateToHome();
        break;
      case "reload":
        speakFeedback("Reloading page...");
        setTimeout(() => location.reload(), 500);
        break;
      case "back":
        if (history.length > 1) {
          speakFeedback("Going back...");
          history.back();
        } else {
          speakFeedback("No previous page. Going home instead.");
          navigateToHome();
        }
        break;
      case "help":
        speakFeedback(
          "Back button help: Click or press Enter to go home. Alt+H to focus. Right click for more options."
        );
        break;
    }
  }
})();
