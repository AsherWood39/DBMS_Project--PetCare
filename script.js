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

// Initialize theme on page load
if (darkmode === "active") enableDarkMode();

// Add click event only if toggle button exists
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    darkmode = localStorage.getItem('darkmode');
    darkmode !== "active" ? enableDarkMode() : disableDarkMode();
  });
}

// Update theme when localStorage changes (sync across tabs)
window.addEventListener('storage', (e) => {
  if (e.key === 'darkmode') {
    if (e.newValue === 'active') {
      enableDarkMode();
    } else {
      disableDarkMode();
    }
  }
});