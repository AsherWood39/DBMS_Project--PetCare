// Shared Theme + Paw Prints

function initializeTheme() {
  let darkmode = localStorage.getItem("darkmode");
  const themeToggle = document.getElementById("theme-toggle");

  const enableDarkMode = () => {
    document.body.classList.add("darkmode");
    localStorage.setItem("darkmode", "active");
  };

  const disableDarkMode = () => {
    document.body.classList.remove("darkmode");
    localStorage.setItem("darkmode", null);
  };

  if (darkmode === "active") enableDarkMode();

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      darkmode = localStorage.getItem("darkmode");
      darkmode !== "active" ? enableDarkMode() : disableDarkMode();
      setTimeout(updatePawPrintsForTheme, 100);
    });
  }

  window.addEventListener("storage", (e) => {
    if (e.key === "darkmode") {
      e.newValue === "active" ? enableDarkMode() : disableDarkMode();
      updatePawPrintsForTheme();
    }
  });
}

function generatePawPrints() {
  const container = document.querySelector(".paw-bg");
  if (!container) return;

  container.innerHTML = "";

  // If file is in public/, reference without /public
  // Root page: "paws.png"
  // Sub page: "../paws.png"
  const inSubPage = window.location.pathname.includes("/pages/");
  const imagePath = inSubPage ? "../paws.png" : "paws.png";

  const totalPaws = 10;
  const patterns = [
    { rotation: 15, scaleX: 1, scaleY: 1 },
    { rotation: -30, scaleX: -1, scaleY: 1 },
    { rotation: 45, scaleX: 1, scaleY: -1 },
    { rotation: 0, scaleX: -1, scaleY: -1 },
    { rotation: 60, scaleX: 1, scaleY: 1 },
    { rotation: -45, scaleX: -1, scaleY: 1 },
    { rotation: 30, scaleX: 1, scaleY: -1 },
    { rotation: -15, scaleX: -1, scaleY: -1 },
    { rotation: 75, scaleX: 1, scaleY: 1 },
    { rotation: -60, scaleX: -1, scaleY: 1 },
  ];

  for (let i = 0; i < totalPaws; i++) {
    const paw = document.createElement("img");
    paw.src = imagePath;
    paw.alt = "";
    paw.className = `paw-dynamic paw-${i + 1}`;

    const pattern = patterns[i % patterns.length];
    const verticalSection = (i / totalPaws) * 0.9 + 0.05;
    const topPct = verticalSection * 100;
    const horizSeed = (i * 77) % 100;
    const minPos = 8;
    const maxPos = 95;
    const base = minPos + (horizSeed / 100) * (maxPos - minPos);
    const verticalInfluence = (topPct * 0.3) % 20 - 10;
    const leftPct = Math.max(5, Math.min(92, base + verticalInfluence));

    paw.style.cssText = `
      position:absolute;
      top:${topPct}%;
      left:${leftPct}%;
      width:125px;
      opacity:0.18;
      transform:rotate(${pattern.rotation}deg) scaleX(${pattern.scaleX}) scaleY(${pattern.scaleY});
      user-select:none;
      pointer-events:none;
      z-index:-1;
    `;
    container.appendChild(paw);
  }
}

function updatePawPrintsForTheme() {
  const dark = document.body.classList.contains("darkmode");
  document.querySelectorAll(".paw-dynamic").forEach((paw) => {
    paw.style.opacity = dark ? "0.18" : "0.08";
    paw.style.filter = dark ? "brightness(2)" : "brightness(1)";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initializeTheme();
  generatePawPrints();

  // Debounced resize
  window.addEventListener("resize", () => {
    clearTimeout(window.__pawResize);
    window.__pawResize = setTimeout(generatePawPrints, 250);
  });
});
