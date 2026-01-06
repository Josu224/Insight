// --- Voice recognition setup ---
const voiceBtn = document.getElementById("voiceBtn");
const voiceStatus = document.getElementById("voiceStatus");

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;
let tts = window.speechSynthesis;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.continuous = false;

  recognition.onstart = () => {
    voiceBtn.classList.add("recording");
    voiceStatus.textContent = "Listening...";
    speak("Listening, please say your destination");
  };

  recognition.onresult = (event) => {
    const command = event.results[0][0].transcript.toLowerCase();
    voiceStatus.textContent = `You said: ${command}`;
    speak(`Navigating to ${command}`);
    setDestination(command);
  };

  recognition.onerror = (event) => {
    voiceStatus.textContent = "Error recognizing speech. Try again.";
    speak("I couldn't hear you, please try again");
    voiceBtn.classList.remove("recording");
    console.error("Speech recognition error:", event.error);
  };

  recognition.onend = () => {
    voiceBtn.classList.remove("recording");
    voiceStatus.textContent = "Tap and hold to speak your destination";
  };
} else {
  voiceStatus.textContent = "Speech recognition not supported";
}

// --- Long press logic ---
let pressTimer;
voiceBtn.addEventListener("mousedown", () => {
  pressTimer = setTimeout(() => recognition.start(), 300);
});
voiceBtn.addEventListener("mouseup", () => clearTimeout(pressTimer));
voiceBtn.addEventListener("mouseleave", () => clearTimeout(pressTimer));
voiceBtn.addEventListener("touchstart", () => {
  pressTimer = setTimeout(() => recognition.start(), 300);
});
voiceBtn.addEventListener("touchend", () => clearTimeout(pressTimer));

// --- TTS helper ---
function speak(text) {
  if (tts.speaking) tts.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "en-US";
  tts.speak(utter);
}

// --- Map setup using Leaflet ---
const map = L.map("map").setView([0, 0], 13);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
}).addTo(map);

let userMarker;
let destMarker;

// --- Geolocation ---
function updatePosition() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      map.setView([latitude, longitude], 16);
      if (!userMarker) {
        userMarker = L.marker([latitude, longitude])
          .addTo(map)
          .bindPopup("You are here")
          .openPopup();
      } else {
        userMarker.setLatLng([latitude, longitude]);
      }
    });
  } else {
    alert("Geolocation is not supported by your browser.");
  }
}
setInterval(updatePosition, 3000); // refresh every 3 seconds

// --- Destination input ---
const destInput = document.getElementById("destInput");
const goBtn = document.getElementById("goBtn");

goBtn.addEventListener("click", () => setDestination(destInput.value));

function setDestination(dest) {
  if (!dest) return;
  // Here you can integrate Google Maps / Mapbox / custom API for routing
  // For demo, we just drop a marker
  const lat = userMarker ? userMarker.getLatLng().lat + 0.001 : 0;
  const lng = userMarker ? userMarker.getLatLng().lng + 0.001 : 0;

  if (destMarker) map.removeLayer(destMarker);

  destMarker = L.marker([lat, lng], {
    icon: L.icon({
      iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
      iconSize: [32, 32],
    }),
  })
    .addTo(map)
    .bindPopup(`Destination: ${dest}`)
    .openPopup();

  voiceStatus.textContent = `Destination set to ${dest}`;
  speak(`Destination set to ${dest}. Please follow the directions.`);
}

const homeLink = document.getElementById("homeLink");

homeLink.addEventListener("click", () => {
  window.location.href = "home.html"; // change to your home page path
});

// Optional: allow Enter key to trigger navigation
homeLink.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    window.location.href = "home.html";
  }
});
