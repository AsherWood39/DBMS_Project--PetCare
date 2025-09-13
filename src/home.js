// Load images from JSON file and initialize everything
console.log('Starting to fetch images...');
fetch('../public/image_urls.json')
  .then(response => {
    console.log('Fetch response:', response);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(imageUrls => {
    console.log('Images loaded:', imageUrls);
    // Set welcome pic
    const welcomePicElement = document.getElementById('welcome-pic');
    console.log('Welcome pic element:', welcomePicElement);
    if (welcomePicElement && imageUrls.main_pic) {
      welcomePicElement.src = imageUrls.main_pic;
      console.log('Welcome pic src set to:', imageUrls.main_pic);
    }
  })
  .catch(error => {
    console.error('Error loading images:', error);
    // Fallback: set a default image
    const welcomePicElement = document.getElementById('welcome-pic');
    if (welcomePicElement) {
      welcomePicElement.src = 'https://via.placeholder.com/400x300?text=Pet+Image';
    }
  });

  // Initialize DOM content when loaded
document.addEventListener('DOMContentLoaded', function() {
  // Any additional initialization can go here
});