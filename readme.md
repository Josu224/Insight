# VisionAssist Web App

**VisionAssist** is a modern, accessible web application designed primarily for visually impaired and partially sighted users. The app provides multiple assistive features including navigation, object detection, voice assistance, text-to-speech, and more, with a strong focus on usability, accessibility, and voice-guided interactions.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Pages](#pages)
- [Technologies Used](#technologies-used)
- [Accessibility & UI/UX](#accessibility--uiux)
- [Installation & Setup](#installation--setup)
- [File Structure](#file-structure)
- [Usage](#usage)
- [Browser Compatibility](#browser-compatibility)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview

VisionAssist is designed to empower users with visual impairments to interact with their environment and digital content efficiently. Using voice recognition, object detection, navigation guidance, and text-to-speech/document-to-speech features, the app provides an inclusive experience that is both intuitive and user-friendly.

---

## Features

- **Voice Assistant:** Speak commands or describe your environment for guidance.
- **Navigation:** Real-time position tracking, route guidance, and voice directions.
- **Call:** Quick access to recent calls.
- **Object Detection:** Detect and describe objects around the user using live camera feed.
- **Text-to-Speech & Document-to-Speech:** Convert typed text or uploaded documents (txt) into speech.
- **Settings:** Fully customizable experience (voice, TTS speed, accessibility options, theme, accent colors, and more).
- **Translate / Capture:** Capture environment text and read it aloud for accessibility.
- **Fully accessible UI:** Keyboard navigable, screen-reader friendly, TTS feedback, high-contrast theme.

---

## Pages

| Page              | Description                                                             |
| ----------------- | ----------------------------------------------------------------------- |
| `index.html`      | Landing page for login/sign-up.                                         |
| `signin.html`     | Sign-in page with shared CSS/JS.                                        |
| `signup.html`     | Sign-up page with shared CSS/JS.                                        |
| `permission.html` | Page for requesting microphone and camera permissions.                  |
| `home.html`       | Main dashboard linking to all features.                                 |
| `assistant.html`  | Virtual assistant page for voice interaction and recording.             |
| `call.html`       | Call log page for previously called contacts.                           |
| `detect.html`     | Object detection with live camera feed and voice feedback.              |
| `navigation.html` | Navigation with real-time map, voice directions, and destination input. |
| `settings.html`   | Fully accessible settings and customization page.                       |
| `translate.html`  | Capture and read environment text aloud or from documents.              |

---

## Technologies Used

- **HTML5** for semantic, accessible markup
- **CSS3** for styling, responsive layout, and accessibility
- **Vanilla JavaScript (ES6)** for interactivity, TTS, speech recognition, and object detection
- **Leaflet.js** for map functionality in navigation page
- **Web Speech API** for voice recognition and TTS

---

## Accessibility & UI/UX

- Dark theme (`rgba(45, 44, 46)`) with high-contrast buttons and text
- Large, readable fonts and comfortable spacing
- Full keyboard navigation with clear focus indicators
- Screen-reader friendly with proper ARIA labels
- Voice guidance (TTS) for all major actions
- Mobile-first responsive layout

---

## Installation & Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/visionassist.git
```
