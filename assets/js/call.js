const homeLink = document.getElementById("homeLink");
const callList = document.getElementById("callList");

// Navigate to home
homeLink.addEventListener("click", () => {
  window.location.href = "/code/home.html";
});
homeLink.addEventListener("keypress", (e) => {
  if (e.key === "Enter") window.location.href = "code/home.html";
});

// Optional: Add a click action for calling a contact
callList.addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
    const contact = e.target.textContent;
    alert(`Calling ${contact}...`);
    // You can integrate WebRTC / actual call API here
  }
});

callList.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && e.target.tagName === "LI") {
    const contact = e.target.textContent;
    alert(`Calling ${contact}...`);
  }
});
