// Shared Theme Functionality
// This script handles theme switching across all pages

function initializeTheme() {
  let darkmode = localStorage.getItem("darkmode");
  const themeToggle = document.getElementById("theme-toggle"); 

  const enableDarkMode = () => {
    document.body.classList.add("darkmode");
    localStorage.setItem("darkmode", "active");
    console.log('Dark mode enabled');
  };

  const disableDarkMode = () => {
    document.body.classList.remove("darkmode");
    localStorage.setItem("darkmode", null);
    console.log('Dark mode disabled');
  };

  // Initialize theme on page load
  if (darkmode === "active") {
    enableDarkMode();
  }

  // Add click event only if toggle button exists
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      darkmode = localStorage.getItem('darkmode');
      if (darkmode !== "active") {
        enableDarkMode();
      } else {
        disableDarkMode();
      }
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
}

// Dynamic Paw Print Background Generator
function generatePawPrints() {
  const pawContainer = document.querySelector('.paw-bg');
  if (!pawContainer) return;

  // Clear existing paw prints (if any)
  pawContainer.innerHTML = '';

  // Configuration for paw prints
  const pawConfig = {
    count: 12, // Number of paw prints
    minSize: 45,
    maxSize: 80,
    minOpacity: 0.08,
    maxOpacity: 0.18,
    imagePath: window.location.pathname.includes('/pages/') ? '../public/paws.png' : './public/paws.png'
  };

  // Generate random paw prints
  for (let i = 0; i < pawConfig.count; i++) {
    const pawPrint = document.createElement('img');
    pawPrint.src = pawConfig.imagePath;
    pawPrint.alt = '';
    pawPrint.className = `paw-dynamic paw-${i + 1}`;

    // Random positioning (avoiding edges)
    const top = Math.random() * 80 + 10; // 10% to 90%
    const left = Math.random() * 80 + 10; // 10% to 90%

    // Random size
    const size = Math.random() * (pawConfig.maxSize - pawConfig.minSize) + pawConfig.minSize;

    // Random rotation
    const rotation = Math.random() * 360;

    // Random flip (scaleX and scaleY)
    const scaleX = Math.random() > 0.5 ? 1 : -1;
    const scaleY = Math.random() > 0.5 ? 1 : -1;

    // Random opacity
    const opacity = Math.random() * (pawConfig.maxOpacity - pawConfig.minOpacity) + pawConfig.minOpacity;

    // Apply styles
    pawPrint.style.cssText = `
      position: absolute;
      top: ${top}%;
      left: ${left}%;
      width: ${size}px;
      height: auto;
      opacity: ${opacity};
      transform: rotate(${rotation}deg) scaleX(${scaleX}) scaleY(${scaleY});
      user-select: none;
      pointer-events: none;
      transition: opacity 0.3s ease;
    `;

    pawContainer.appendChild(pawPrint);
  }
}

// Enhanced version with predefined positions for better distribution
function generatePawPrintsEnhanced() {
  const pawContainer = document.querySelector('.paw-bg');
  if (!pawContainer) return;

  // Clear existing paw prints
  pawContainer.innerHTML = '';

  // Determine the correct image path based on page location
  let imagePath = './public/paws.png'; // Default for root pages
  
  // Check if we're in a subfolder (like pages/)
  if (window.location.pathname.includes('/pages/')) {
    imagePath = '../public/paws.png';
  }

  // Predefined positions for better distribution
  const positions = [
    { top: 15, left: 10 },
    { top: 25, left: 75 },
    { top: 40, left: 20 },
    { top: 35, left: 60 },
    { top: 55, left: 85 },
    { top: 65, left: 15 },
    { top: 75, left: 70 },
    { top: 85, left: 40 },
    { top: 20, left: 45 },
    { top: 50, left: 5 },
    { top: 80, left: 25 },
    { top: 30, left: 90 }
  ];

  positions.forEach((pos, index) => {
    const pawPrint = document.createElement('img');
    pawPrint.src = imagePath;
    pawPrint.alt = '';
    pawPrint.className = `paw-dynamic paw-${index + 1}`;

    // Random variations
    const size = 120; // 100px
    const rotation = Math.random() * 360;
    const scaleX = Math.random() > 0.5 ? 1 : -1;
    const scaleY = Math.random() > 0.5 ? 1 : -1;
    const opacity = 0.08; // 0.08

    // Add some random offset to positions
    const topOffset = (Math.random() - 0.5) * 10;
    const leftOffset = (Math.random() - 0.5) * 10;

    pawPrint.style.cssText = `
      position: absolute;
      top: ${pos.top + topOffset}%;
      left: ${pos.left + leftOffset}%;
      width: ${size}px;
      height: auto;
      opacity: ${opacity};
      transform: rotate(${rotation}deg) scaleX(${scaleX}) scaleY(${scaleY});
      user-select: none;
      pointer-events: none;
      transition: opacity 0.3s ease;
    `;

    pawContainer.appendChild(pawPrint);
  });
}

// Function to regenerate paw prints (useful for theme changes)
function updatePawPrintsForTheme() {
  const pawPrints = document.querySelectorAll('.paw-dynamic');
  const isDarkMode = document.body.classList.contains('darkmode');
  
  pawPrints.forEach(paw => {
    if (isDarkMode) {
      paw.style.opacity = parseFloat(paw.style.opacity) * 0.6; // Reduce opacity in dark mode
      paw.style.filter = 'brightness(20)';
    } else {
      paw.style.filter = 'brightness(1)';
      // Restore original opacity (you might want to store original values)
    }
  });
}

// Auto-initialize theme when script loads
document.addEventListener('DOMContentLoaded', function() {
  initializeTheme();
  
  // Initialize paw prints
  generatePawPrintsEnhanced();
  
  // Update paw prints when theme changes
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      // Small delay to let theme change complete
      setTimeout(updatePawPrintsForTheme, 100);
    });
  }
  
  // Optional: Regenerate paw prints on window resize
  window.addEventListener('resize', function() {
    // Debounce the resize event
    clearTimeout(window.pawResizeTimeout);
    window.pawResizeTimeout = setTimeout(generatePawPrintsEnhanced, 250);
  });
});
