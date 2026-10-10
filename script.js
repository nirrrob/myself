
const TARGET_DATE = new Date("2029-06-30T23:59:59");
const START_DATE = new Date("2025-09-01T00:00:00");

const $ = (id) => document.getElementById(id);

// Countdown timer
function updateCountdown() {
  const now = new Date();
  const difference = Math.max(0, TARGET_DATE.getTime() - now.getTime());

  const days = Math.floor(difference / 86400000);
  const hours = Math.floor((difference % 86400000) / 3600000);
  const minutes = Math.floor((difference % 3600000) / 60000);
  const seconds = Math.floor((difference % 60000) / 1000);

  $("days").textContent = String(days).padStart(3, "0");
  $("hours").textContent = String(hours).padStart(2, "0");
  $("minutes").textContent = String(minutes).padStart(2, "0");
  $("seconds").textContent = String(seconds).padStart(2, "0");

  const totalDuration = TARGET_DATE.getTime() - START_DATE.getTime();
  const elapsed = now.getTime() - START_DATE.getTime();
  const progress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));

  $("progressBar").style.width = `${progress}%`;
  $("progressPercent").textContent = `${progress.toFixed(1)}%`;

  if (difference === 0) {
    $("days").textContent = "000";
    $("hours").textContent = "00";
    $("minutes").textContent = "00";
    $("seconds").textContent = "00";
    $("progressPercent").textContent = "TARGET REACHED";
  }
}

function updateLocalTime() {
  $("localTime").textContent = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Dhaka",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  }).format(new Date());
}

// Footer year
$("year").textContent = new Date().getFullYear();

// Reveal sections as they enter the viewport
const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
}

// Mobile navigation
const menuToggle = $("menuToggle");
const nav = document.querySelector(".navbar nav");

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.textContent = isOpen ? "✕" : "☰";
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  });
});

updateCountdown();
updateLocalTime();
setInterval(updateCountdown, 1000);
setInterval(updateLocalTime, 1000);
