// Load images from JSON file and initialize everything
console.log('Starting to fetch images...');
fetch('./public/image_urls.json')
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

// Initialize DOM content when loaded
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('home-link').addEventListener('click', function(e) {
    if (typeof isAuthenticated === 'function' && !isAuthenticated()) {
      e.preventDefault();
    }
    else {
      window.location.href = './pages/home.html';
    }
  });
});