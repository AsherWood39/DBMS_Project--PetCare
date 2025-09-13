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

  // Clear existing paw prints
  pawContainer.innerHTML = '';

  // Determine the correct image path based on page location
  let imagePath = './public/paws.png'; // Default for root pages
  
  // Check if we're in a subfolder (like pages/)
  if (window.location.pathname.includes('/pages/')) {
    imagePath = '../public/paws.png';
  }

  // Number of paws is set to 10 for better coverage
  const totalPaws = 10;

  // Predefined patterns for consistent, non-random placement
  const patterns = [
    { rotation: 15, scaleX: 1, scaleY: 1, leftBase: 10, rightBase: 80 },
    { rotation: -30, scaleX: -1, scaleY: 1, leftBase: 15, rightBase: 75 },
    { rotation: 45, scaleX: 1, scaleY: -1, leftBase: 20, rightBase: 70 },
    { rotation: 0, scaleX: -1, scaleY: -1, leftBase: 8, rightBase: 85 },
    { rotation: 60, scaleX: 1, scaleY: 1, leftBase: 25, rightBase: 65 },
    { rotation: -45, scaleX: -1, scaleY: 1, leftBase: 5, rightBase: 90 },
    { rotation: 30, scaleX: 1, scaleY: -1, leftBase: 12, rightBase: 78 },
    { rotation: -15, scaleX: -1, scaleY: -1, leftBase: 18, rightBase: 72 },
    { rotation: 75, scaleX: 1, scaleY: 1, leftBase: 22, rightBase: 68 },
    { rotation: -60, scaleX: -1, scaleY: 1, leftBase: 7, rightBase: 88 }
  ];

  // Generate systematically positioned paw prints
  for (let i = 0; i < totalPaws; i++) {
    const pawPrint = document.createElement('img');
    pawPrint.src = imagePath;
    pawPrint.alt = '';
    pawPrint.className = `paw-dynamic paw-${i + 1}`;

    // Get pattern for this paw
    const pattern = patterns[i % patterns.length];
    
    // Calculate vertical position - distribute evenly across page height
    const verticalSection = (i / totalPaws) * 0.9 + 0.05; // 5% to 95%
    const topPercentage = verticalSection * 100;
    
    // Advanced horizontal distribution to prevent pairing/clustering
    // Use prime number multiplication to create better spread
    const primeMultiplier = 77; // Large prime for good distribution
    const horizontalSpread = (i * primeMultiplier) % 100;
    
    // Map the spread to avoid edges and ensure minimum spacing
    // This creates positions from 8% to 95% with automatic spacing
    const minPos = 8;
    const maxPos = 95;
    const range = maxPos - minPos;
    const basePosition = minPos + (horizontalSpread / 100) * range;
    
    // Add a secondary offset based on vertical position to break any remaining patterns
    const verticalInfluence = (topPercentage * 0.3) % 20 - 10; // ±10% based on height
    const finalPosition = basePosition + verticalInfluence;
    
    const leftPercentage = Math.max(5, Math.min(92, finalPosition));

    const size = 125; // Increased size for better visibility
    const opacity = 0.18; // Increased opacity

    pawPrint.style.cssText = `
      position: absolute;
      top: ${topPercentage}%;
      left: ${leftPercentage}%;
      width: ${size}px;
      height: auto;
      opacity: ${opacity};
      transform: rotate(${pattern.rotation}deg) scaleX(${pattern.scaleX}) scaleY(${pattern.scaleY});
      user-select: none;
      pointer-events: none;
      transition: opacity 0.3s ease;
      z-index: -1;
    `;

    pawContainer.appendChild(pawPrint);
  }

  console.log(`Generated ${totalPaws} paw prints for page height: ${pageHeight}px`);
}

// Function to regenerate paw prints (useful for theme changes)
function updatePawPrintsForTheme() {
  const pawPrints = document.querySelectorAll('.paw-dynamic');
  const isDarkMode = document.body.classList.contains('darkmode');
  pawPrints.forEach(paw => {
    paw.style.opacity = isDarkMode ? '0.18' : '0.08';
    paw.style.filter = isDarkMode ? 'brightness(2)' : 'brightness(1)';
  });
}

// Auto-initialize theme when script loads
document.addEventListener('DOMContentLoaded', function() {
  initializeTheme();
  
  // Initialize paw prints with enhanced positioning
  generatePawPrints();
  
  // Update paw prints when theme changes
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      // Small delay to let theme change complete
      setTimeout(updatePawPrintsForTheme, 100);
    });
  }
  
  // Regenerate paw prints when page content changes (e.g., dynamic loading)
  const observer = new MutationObserver(function(mutations) {
    let shouldRegenerate = false;
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        shouldRegenerate = true;
      }
    });
    
    if (shouldRegenerate) {
      // Debounce regeneration
      clearTimeout(window.pawRegenerateTimeout);
      window.pawRegenerateTimeout = setTimeout(generatePawPrints, 500);
    }
  });
  
  // Observe changes to body content
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Regenerate paw prints on window resize with debouncing
  window.addEventListener('resize', function() {
    clearTimeout(window.pawResizeTimeout);
    window.pawResizeTimeout = setTimeout(function() {
      generatePawPrints();
    }, 250);
  });
});
