// Load images from JSON file and initialize everything
console.log('Starting to fetch images...');
fetch('public/image_urls.json')
  .then(response => {
    console.log('Fetch response:', response);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(imageUrls => {
    console.log('Images loaded:', imageUrls);
    // Set main pic
    const mainPicElement = document.getElementById('main-pic');
    console.log('Main pic element:', mainPicElement);
    if (mainPicElement && imageUrls.main_pic) {
      mainPicElement.src = imageUrls.main_pic;
      console.log('Main pic src set to:', imageUrls.main_pic);
    }

    // Set footer pic
    const footerPicElement = document.getElementById('footer-pic');
    if (footerPicElement && imageUrls.footer_pic) {
      footerPicElement.src = imageUrls.footer_pic;
    }

    // Initialize carousel with images from JSON
    initializeCarousel();
    generateCarouselImages(imageUrls);
  })
  .catch(error => {
    console.error('Error loading images:', error);
    // Fallback: set a default image
    const mainPicElement = document.getElementById('main-pic');
    if (mainPicElement) {
      mainPicElement.src = 'https://via.placeholder.com/400x300?text=Pet+Image';
    }
    
    // Initialize carousel with fallback images
    initializeCarousel();
    generateCarouselImages(null);
  });

function initializeCarousel() {
  const reviews = [
    {
      name: "Stacy, Rottweiler",
      details: "12 years",
      text: "Fusce auctor pellentesque odio ut varius. Suspendisse id tortor massa. Cras fringilla dapibus dictum. Donec vitae diam ut tortor condimentum iaculis quis est faucibus cursus."
    },
    {
      name: "Mike, Golden Retriever",
      details: "8 years",
      text: "Amazing service! My dog was so well taken care of. The staff was professional and caring."
    },
    {
      name: "Sarah, Beagle",
      details: "5 years",
      text: "Excellent grooming service. My pet looks fantastic and the staff was very gentle."
    },
    {
      name: "John, German Shepherd",
      details: "7 years",
      text: "Highly recommend PetCare. They treat every pet like family."
    }
  ];

  let current = 0;
  const container = document.getElementById('review-carousel');
  if (!container) return;

  function renderReview(idx) {
    const review = reviews[idx];
    container.innerHTML = `
      <div class="carousel-content">
      <button class="carousel-nav-btn prev" id="carousel-prev">&#8249;</button>
      <div class="carousel-text-section">
        <p class="carousel-text" style="
        width: 100%;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        max-height: 3em;
        ">${review.text}</p>
        <div class="carousel-author">
        <strong>${review.name}</strong><br>
        <span class="carousel-details">${review.details}</span>
        </div>
      </div>
      <button class="carousel-nav-btn next" id="carousel-next">&#8250;</button>
      </div>
    `;
    document.getElementById('carousel-prev').onclick = () => {
      current = (current - 1 + reviews.length) % reviews.length;
      renderReview(current);
    };
    document.getElementById('carousel-next').onclick = () => {
      current = (current + 1) % reviews.length;
      renderReview(current);
    };
  }
  renderReview(current);
}

function generateCarouselImages(imageUrls) {
  // Create or get the carousel images container
  let imagesContainer = document.getElementById('carousel-images-container');
  
  if (!imagesContainer) {
    // Create the container if it doesn't exist
    imagesContainer = document.createElement('div');
    imagesContainer.id = 'carousel-images-container';
    imagesContainer.className = 'carousel-images-row';
    
    // Insert it before the carousel container
    const carouselContainer = document.getElementById('review-carousel');
    if (carouselContainer && carouselContainer.parentNode) {
      carouselContainer.parentNode.insertBefore(imagesContainer, carouselContainer);
    }
  }
  
  // Clear existing images
  imagesContainer.innerHTML = '';
  
  // Define the carousel image keys and fallback URLs
  const imageKeys = [
    'carousel-image1',
    'carousel-image2', 
    'carousel-image3',
    'carousel-image4',
    'carousel-image5'
  ];
  
  const fallbackImages = [
    'https://via.placeholder.com/150x150?text=Dog+1',
    'https://via.placeholder.com/150x150?text=Dog+2',
    'https://via.placeholder.com/150x150?text=Dog+3',
    'https://via.placeholder.com/150x150?text=Dog+4',
    'https://via.placeholder.com/150x150?text=Dog+5',
    'https://via.placeholder.com/150x150?text=Dog+6'
  ];
  
  // Generate images
  imageKeys.forEach((key, index) => {
    const imgDiv = document.createElement('div');
    imgDiv.className = 'carousel-image-item';
    
    const img = document.createElement('img');
    img.src = imageUrls && imageUrls[key] ? imageUrls[key] : fallbackImages[index];
    img.alt = `Pet ${index + 1}`;
    img.className = 'carousel-pet-image';
    
    imgDiv.appendChild(img);
    imagesContainer.appendChild(imgDiv);
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
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
});

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
    imagePath: './public/paws.png'
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
    pawPrint.src = './public/paws.png';
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

// Initialize paw prints when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Use either generatePawPrints() for random or generatePawPrintsEnhanced() for better distribution
  generatePawPrintsEnhanced();
});

// Update paw prints when theme changes
document.addEventListener('DOMContentLoaded', function() {
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      // Small delay to let theme change complete
      setTimeout(updatePawPrintsForTheme, 100);
    });
  }
});

// Optional: Regenerate paw prints on window resize
window.addEventListener('resize', function() {
  // Debounce the resize event
  clearTimeout(window.pawResizeTimeout);
  window.pawResizeTimeout = setTimeout(generatePawPrintsEnhanced, 250);
});