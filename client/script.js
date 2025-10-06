function resolveAssetPath(p) {
  if (!p) return '';
  // Treat already-absolute or inline sources as-is
  if (/^(https?:|data:|blob:)/i.test(p)) return p;
  const base = import.meta.env.BASE_URL || '/';
  return base + p.replace(/^\/+/, '');
}

// Fetch images JSON from public root (Vite copies public/* to dist root)
console.log('Starting to fetch images...');
fetch(`${import.meta.env.BASE_URL}image_urls.json`)
  .then(response => {
    console.log('Fetch response:', response);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(imageUrls => {
    console.log('Images loaded:', imageUrls);

    // Main pic
    const mainPicElement = document.getElementById('main-pic');
    if (mainPicElement && imageUrls.main_pic) {
      mainPicElement.src = resolveAssetPath(imageUrls.main_pic);
      console.log('Main pic src set to:', mainPicElement.src);
    }

    // Footer pic
    const footerPicElement = document.getElementById('footer-pic');
    if (footerPicElement && imageUrls.footer_pic) {
      footerPicElement.src = resolveAssetPath(imageUrls.footer_pic);
    }

    // Initialize carousel
    initializeCarousel();
    generateCarouselImages(imageUrls);
  })
  .catch(error => {
    console.error('Error loading images:', error);
    const mainPicElement = document.getElementById('main-pic');
    if (mainPicElement) {
      mainPicElement.src = 'https://via.placeholder.com/400x300?text=Pet+Image';
    }
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
    },
    {
      name: "Priya, Persian Cat",
      details: "3 years",
      text: "PetCare helped me find the perfect companion. The adoption process was smooth and transparent."
    },
    {
      name: "Amit, Cockatiel",
      details: "2 years",
      text: "My bird received excellent medical care. The team is knowledgeable and friendly."
    },
    {
      name: "Emily, Husky",
      details: "4 years",
      text: "The training sessions were fun and effective. My Husky is happier and healthier!"
    },
    {
      name: "Ravi, Labrador",
      details: "6 years",
      text: "Great experience with PetCare. The staff truly loves animals."
    },
    {
      name: "Sonia, Tabby Cat",
      details: "2 years",
      text: "I appreciate the regular updates and support. My cat settled in quickly."
    }
  ];

  let current = Math.floor(Math.random() * reviews.length);
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
  let imagesContainer = document.getElementById('carousel-images-container');
  if (!imagesContainer) {
    imagesContainer = document.createElement('div');
    imagesContainer.id = 'carousel-images-container';
    imagesContainer.className = 'carousel-images-row';
    const carouselContainer = document.getElementById('review-carousel');
    if (carouselContainer?.parentNode) {
      carouselContainer.parentNode.insertBefore(imagesContainer, carouselContainer);
    }
  }
  imagesContainer.innerHTML = '';

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
    'https://via.placeholder.com/150x150?text=Dog+5'
  ];

  imageKeys.forEach((key, index) => {
    const imgDiv = document.createElement('div');
    imgDiv.className = 'carousel-image-item';

    const img = document.createElement('img');
    const candidate = imageUrls && imageUrls[key] ? resolveAssetPath(imageUrls[key]) : fallbackImages[index];
    img.src = candidate;
    img.alt = `Pet ${index + 1}`;
    img.className = 'carousel-pet-image';

    imgDiv.appendChild(img);
    imagesContainer.appendChild(imgDiv);
  });
}

// Initialize DOM content when loaded
document.addEventListener('DOMContentLoaded', function() {
  const homeLink = document.getElementById('home-link');
  const loginButton = document.getElementById('login-button');
  const signupButton = document.getElementById('signup-button');
  const profileButton = document.getElementById('profile-button');
  const logoutButton = document.getElementById('logout-button');
  const adopterButton = document.getElementById('adopter-button');
  const ownerButton = document.getElementById('owner-button');
  if (homeLink) {
    homeLink.addEventListener('click', function(e) {
      if (typeof isAuthenticated === 'function' && !isAuthenticated()) {
        e.preventDefault();
      } else {
        window.location.href = '/pages/home.html';
      }
    });
  }
  if (loginButton) {
    loginButton.addEventListener('click', function(e) {
      e.preventDefault();
      window.location.href = '/pages/login.html';
    });
  }
  if (signupButton) {
    signupButton.addEventListener('click', function(e) {
      e.preventDefault();
      window.location.href = '/pages/signup.html';
    });
  }
  if (profileButton) {
    profileButton.addEventListener('click', function(e) {
      e.preventDefault();
      if (typeof isAuthenticated === 'function' && !isAuthenticated()) {
        alert('Please log in to view your profile.');
        window.location.href = '/pages/login.html';
      } else {
        window.location.href = '/pages/profile.html';
      }
    });
  }
  if (logoutButton) {
    logoutButton.addEventListener('click', function(e) {
      e.preventDefault();
      if (typeof logout === 'function') {
        logout();
      }
      window.location.href = './index.html';
    });
  }
  if (adopterButton) {
    adopterButton.addEventListener('click', function(e) {
      e.preventDefault();
      localStorage.setItem('signupRole', 'Adopter');
      window.location.href = '/pages/signup.html';
    });
  }
  if (ownerButton) {
    ownerButton.addEventListener('click', function(e) {
      e.preventDefault();
      localStorage.setItem('signupRole', 'Owner');
      window.location.href = '/pages/signup.html';
    });
  }

  const breedDetectorButton = document.querySelector('.breed-detector');
  if (breedDetectorButton) {
    breedDetectorButton.addEventListener('click', breedDetector);
  }
});

// Breed Detector Implementation - Fixed Version
let breedDetectorPopup = null;

function breedDetector() {
  console.log('Breed detector clicked');
  // Create popup if it doesn't exist
  if (!breedDetectorPopup) {
    createBreedDetectorPopup();
  }
  
  // Show the popup
  breedDetectorPopup.style.display = 'flex';
}

function createBreedDetectorPopup() {
  console.log('Creating breed detector popup');
  // Create popup container
  breedDetectorPopup = document.createElement('div');
  breedDetectorPopup.className = 'breed-detector-popup';
  breedDetectorPopup.innerHTML = `
    <div class="breed-detector-content">
      <div class="breed-detector-header">
        <h2>🐾 AI Breed Detector 🐾</h2>
        <button class="close-btn" id="close-detector-btn">&times;</button>
      </div>
      
      <div class="breed-detector-body">
        <div class="upload-section" id="upload-section">
          <div class="upload-area" id="upload-area">
            <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="currentColor">
              <path d="M260-160q-91 0-155.5-63T40-377q0-78 47-139t123-78q25-92 100-149t170-57q117 0 198.5 81.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160H520q-33 0-56.5-23.5T440-240v-206l-64 62-56-56 160-160 160 160-56 56-64-62v206h220q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-80q0-83-58.5-141.5T480-720q-83 0-141.5 58.5T280-520h-20q-58 0-99 41t-41 99q0 58 41 99t99 41h100v80H260Z"/>
            </svg>
            <p class="upload-text">Click to upload or drag and drop</p>
            <p class="upload-subtext">Support: JPG, PNG, WEBP (Max 5MB)</p>
            <input type="file" id="image-input" accept="image/*" style="display: none;">
          </div>
        </div>
        
        <div class="preview-section" id="preview-section" style="display: none;">
          <img id="preview-image" src="" alt="Preview">
          <button class="change-image-btn" id="change-image-btn">Change Image</button>
          <button class="analyze-btn" id="analyze-breed-btn">Analyze Breed</button>
        </div>
        
        <div class="results-section" id="results-section" style="display: none;">
          <div class="loading" id="loading">
            <div class="spinner"></div>
            <p>Analyzing your pet's image...</p>
          </div>
          
          <div class="result-content" id="result-content" style="display: none;">
            <div class="result-header">
              <h3>Analysis Results</h3>
            </div>
            <div class="result-body" id="result-body"></div>
            <button class="new-analysis-btn" id="new-analysis-btn">Analyze Another Pet</button>
          </div>
        </div>
      </div>
  `;
  
  document.body.appendChild(breedDetectorPopup);
  console.log('Popup added to body');
  
  // Setup event listeners
  setupEventListeners();
}

function setupEventListeners() {
  console.log('Setting up event listeners');
  // Get all required elements
  const uploadArea = document.getElementById('upload-area');
  const imageInput = document.getElementById('image-input');
  const closeBtn = document.getElementById('close-detector-btn');
  const changeImageBtn = document.getElementById('change-image-btn');
  const analyzeBreedBtn = document.getElementById('analyze-breed-btn');
  const newAnalysisBtn = document.getElementById('new-analysis-btn');

  // Add event listeners for the buttons
  if (closeBtn) {
    closeBtn.addEventListener('click', closeBreedDetector);
    console.log('Close button listener added');
  }
  if (changeImageBtn) {
    changeImageBtn.addEventListener('click', changeImage);
    console.log('Change image button listener added');
  }
  if (analyzeBreedBtn) {
    analyzeBreedBtn.addEventListener('click', analyzeBreed);
    console.log('Analyze button listener added');
  }
  if (newAnalysisBtn) {
    newAnalysisBtn.addEventListener('click', resetDetector);
    console.log('New analysis button listener added');
  }
  
  // Click to upload
  if (uploadArea && imageInput) {
    uploadArea.addEventListener('click', () => {
      imageInput.click();
    });
    
    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.classList.add('drag-over');
    });
    
    uploadArea.addEventListener('dragleave', () => {
      uploadArea.classList.remove('drag-over');
    });
    
    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.classList.remove('drag-over');
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        handleImageUpload(file);
      }
    });
    
    // File input change
    imageInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        handleImageUpload(file);
      }
    });
  }
  
  // Close on outside click
  if (breedDetectorPopup) {
    breedDetectorPopup.addEventListener('click', (e) => {
      if (e.target === breedDetectorPopup) {
        closeBreedDetector();
      }
    });
  }
}

function handleImageUpload(file) {
  console.log('Handling image upload:', file.name);
  // Validate file size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    alert('File size must be less than 5MB');
    return;
  }

  // Validate file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    alert(`Invalid file type: ${file.type}\nSupported formats: JPG, PNG, WEBP`);
    return;
  }
  
  // Read and preview image
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const previewImage = document.getElementById('preview-image');
      if (!previewImage) {
        console.error('Preview image element not found');
        return;
      }
      previewImage.src = e.target.result;
      
      // Store image data for analysis
      window.currentImageData = e.target.result;
      
      console.log('Image loaded successfully');
      
      // Show preview section
      const uploadSection = document.getElementById('upload-section');
      const previewSection = document.getElementById('preview-section');
      
      if (uploadSection) uploadSection.style.display = 'none';
      if (previewSection) previewSection.style.display = 'block';
    } catch (error) {
      console.error('Error loading image:', error);
      alert('Failed to load image. Please try another file.');
    }
  };
  reader.readAsDataURL(file);
}

function changeImage() {
  console.log('Changing image');
  const previewSection = document.getElementById('preview-section');
  const uploadSection = document.getElementById('upload-section');
  const imageInput = document.getElementById('image-input');
  
  if (previewSection) previewSection.style.display = 'none';
  if (uploadSection) uploadSection.style.display = 'block';
  if (imageInput) imageInput.value = '';
  window.currentImageData = null;
}

async function analyzeBreed() {
  console.log('Starting breed analysis');
  const resultsSection = document.getElementById('results-section');
  const loading = document.getElementById('loading');
  const resultContent = document.getElementById('result-content');
  const previewSection = document.getElementById('preview-section');
  
  // Show loading
  if (previewSection) previewSection.style.display = 'none';
  if (resultsSection) resultsSection.style.display = 'block';
  if (loading) loading.style.display = 'block';
  if (resultContent) resultContent.style.display = 'none';
  
  try {
    // Get API key from environment or config
    const API_KEY = await getApiKey();
    
    if (!API_KEY) {
      throw new Error('API key not found. Please configure VITE_GEMINI_API_KEY in your .env file.');
    }
    
    console.log('API key found, making request...');
    
    // Convert base64 to the format Gemini expects
    const base64Data = window.currentImageData.split(',')[1];
    const mimeType = window.currentImageData.split(',')[0].split(':')[1].split(';')[0];
    
    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Analyze this pet image and provide detailed information about the breed. Please include:
                  1. Pet Type (Dog/Cat/Bird)
                  2. Breed Name (be specific)
                  3. Confidence Level
                  4. Key Physical Characteristics
                  5. Typical Temperament
                  6. Care Requirements
                  7. Health Considerations
                  
                  Format your response in a clear, structured way. If you're uncertain about the breed, mention possible breeds. Use the following for reference for the reply format. Make sure to start from 1. Pet Type and don't include any intro text and make the points like 1. Pet Type bold:
                  1. Pet Type: Dog 
                  2. Breed Name: Golden Retriever 
                  3. Confidence Level: Very High (99%) - The dog in the image displays all the quintessential and classic features of a purebred Golden Retriever. 
                  4. Key Physical Characteristics: 
                      - Coat: The dog has a dense, long, and lustrous double coat, which is water-repellent. The color is a rich shade of gold, which is a hallmark of the breed. 
                      - Feathering: There is prominent feathering (longer hair) on the neck, chest, and likely on the back of the legs and tail, which is characteristic of the breed. 
                      - Head and Face: The head is broad with a well-defined stop. The muzzle is straight and strong. 
                      -  ........`
                },
                {
                  inline_data: {
                    mime_type: mimeType,
                    data: base64Data
                  }
                }
              ]
            }
          ]
        })
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('API error:', errorData);
      throw new Error(`API request failed: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }
    
    const data = await response.json();
    console.log('API response received');
    const analysisText = data.candidates[0].content.parts[0].text;
    
    // Display results
    displayResults(analysisText);
    
  } catch (error) {
    console.error('Error analyzing breed:', error);
    displayError(error.message);
  }
}

async function getApiKey() {
  // Try to get from environment variable (Vite)
  if (import.meta.env.VITE_GEMINI_API_KEY) {
    console.log('API key found in import.meta.env');
    return import.meta.env.VITE_GEMINI_API_KEY;
  }
  
  // Try to get from a config file or global variable
  if (window.VITE_GEMINI_API_KEY) {
    console.log('API key found in window.VITE_GEMINI_API_KEY');
    return window.VITE_GEMINI_API_KEY;
  }
  
  // For development, you can also check localStorage (not recommended for production)
  const localKey = localStorage.getItem('VITE_GEMINI_API_KEY');
  if (localKey) {
    console.log('API key found in localStorage');
    return localKey;
  }
  
  console.error('No API key found');
  return null;
}

function displayResults(analysisText) {
  console.log('Displaying results');
  const loading = document.getElementById('loading');
  const resultContent = document.getElementById('result-content');
  const resultBody = document.getElementById('result-body');
  
  if (!resultBody) {
    console.error('Result body element not found');
    return;
  }
  
  // Format the analysis text with proper HTML
  const formattedText = analysisText
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');
  
  resultBody.innerHTML = `
    <div class="analysis-result">
      <p>${formattedText}</p>
    </div>
  `;
  
  if (loading) loading.style.display = 'none';
  if (resultContent) resultContent.style.display = 'block';
}

function displayError(errorMessage) {
  console.log('Displaying error:', errorMessage);
  const loading = document.getElementById('loading');
  const resultContent = document.getElementById('result-content');
  const resultBody = document.getElementById('result-body');
  
  if (!resultBody) {
    console.error('Result body element not found');
    return;
  }
  
  resultBody.innerHTML = `
    <div class="error-message">
      <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#ff4444">
        <path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/>
      </svg>
      <h3>Analysis Failed</h3>
      <p>${errorMessage}</p>
      <button id="retry-btn" class="retry-btn">Try Again</button>
    </div>
  `;
  
  // Add event listener to retry button
  const retryBtn = document.getElementById('retry-btn');
  if (retryBtn) {
    retryBtn.addEventListener('click', resetDetector);
  }
  
  if (loading) loading.style.display = 'none';
  if (resultContent) resultContent.style.display = 'block';
}

function resetDetector() {
  console.log('Resetting detector');
  const resultsSection = document.getElementById('results-section');
  const uploadSection = document.getElementById('upload-section');
  const previewSection = document.getElementById('preview-section');
  const imageInput = document.getElementById('image-input');
  
  if (resultsSection) resultsSection.style.display = 'none';
  if (uploadSection) uploadSection.style.display = 'block';
  if (previewSection) previewSection.style.display = 'none';
  if (imageInput) imageInput.value = '';
  window.currentImageData = null;
}

function closeBreedDetector() {
  console.log('Closing breed detector');
  if (breedDetectorPopup) {
    breedDetectorPopup.style.display = 'none';
    resetDetector();
  }
}

// Make functions globally available (for debugging)
window.breedDetector = breedDetector;
window.closeBreedDetector = closeBreedDetector;

// Export for module usage
export { breedDetector };

// Make breedDetector globally accessible
window.breedDetector = breedDetector;
window.closeBreedDetector = closeBreedDetector;
window.changeImage = changeImage;
window.analyzeBreed = analyzeBreed;
window.resetDetector = resetDetector;