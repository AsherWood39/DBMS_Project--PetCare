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

  const role = localStorage.getItem('userRole'); // "Owner" or "Adopter"

  // Show appropriate welcome text based on user role
  const adopterText = document.getElementById('welcome-text-adopter');
  const ownerText = document.getElementById('welcome-text-owner');

  if (role === 'Owner') {
    // Show owner-specific welcome text
    if (ownerText) ownerText.style.display = 'block';
    if (adopterText) adopterText.style.display = 'none';

  } else if (role === 'Adopter') {
    // Show adopter-specific welcome text
    if (adopterText) adopterText.style.display = 'block';
    if (ownerText) ownerText.style.display = 'none';
  } else {
    // Default case - show adopter text if no role is set
    if (adopterText) adopterText.style.display = 'block';
    if (ownerText) ownerText.style.display = 'none';
  }

  // Update the main action button (welcome-adopt-btn) based on role
  const mainActionBtn = document.getElementById('welcome-adopt-btn');
  if (mainActionBtn) {
    const link = mainActionBtn.querySelector("a");
    if (link) {
      if (role === 'Owner') {
        mainActionBtn.textContent = "";
        link.textContent = "Add a Pet";
        link.href = "owner_feature.html";
        mainActionBtn.appendChild(link);
      } else {
        // Default to adopter functionality (including when role is 'Adopter' or undefined)
        mainActionBtn.textContent = "";
        link.textContent = "Adopt a Pet";
        link.href = "feature.html";
        mainActionBtn.appendChild(link);
      }
    }
  }
});