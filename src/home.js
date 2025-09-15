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
        link.href = "post_pet.html";
        mainActionBtn.appendChild(link);
      } else {
        // Default to adopter functionality (including when role is 'Adopter' or undefined)
        mainActionBtn.textContent = "";
        link.textContent = "Adopt a Pet";
        link.href = "#view-pets";
        mainActionBtn.appendChild(link);
      }
    }
  }
});

const pets = [
  { name: "Bruno", age: "8-12 weeks", breed: "Labrador", gender: "Male", type: "Dog", image: "../public/pet1.jpg" },
  { name: "Mittens", age: "2 years", breed: "Tabby Cat", gender: "Female", type: "Cat", image: "../public/pet2.jpg" },
  { name: "Rocky", age: "2 years", breed: "Australian Shepherd", gender: "Male", type: "Dog", image: "../public/pet3.jpg" },
  { name: "Bella", age: "8 weeks", breed: "Munchkin", gender: "Female", type: "Cat", image: "../public/pet4.jpg" },
  { name: "Charlie", age: "1 year", breed: "Corgi", gender: "Male", type: "Dog", image: "../public/pet5.jpg" },
  { name: "Luna", age: "2 years", breed: "Husky", gender: "Female", type: "Dog", image: "../public/pet6.jpg" },
  { name: "Sunny", age: "3 years", breed: "White Cockatoo", gender: "Male", type: "Bird", image: "../public/pet7.jpg" },
  { name: "Coco", age: "12 weeks", breed: "Cockatiel", gender: "Female", type: "Bird", image: "../public/pet8.jpg" },
  { name: "Sky", age: "2 years", breed: "Macaw", gender: "Male", type: "Bird", image: "../public/pet9.jpg" },
  { name: "Snowy", age: "2.5 years", breed: "Persian Cat", gender: "Female", type: "Cat", image: "../public/pet10.jpg" }
];

const container = document.getElementById("pets-container");
const buttons = document.querySelectorAll("#filter-buttons button");

// Show all pets initially
displayPets("All");

// Button filter functionality
buttons.forEach(button => {
  button.addEventListener("click", () => {
    buttons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    displayPets(button.getAttribute("data-type"));
  });
});
// Display pets with clickable "View Details"
function displayPets(type = "All") {
  container.innerHTML = "";
  pets.forEach(pet => {
    if (type === "All" || pet.type === type) {
      const card = document.createElement("div");
      card.className = "pet-card";
      card.innerHTML = `
        <img src="${pet.image}" alt="${pet.name}">
        <h3>${pet.name}</h3>
        <p>Age: ${pet.age}</p>
        <p>Breed: ${pet.breed}</p>
        <p>Gender: ${pet.gender}</p>
        <a href="../pages/details.html">
          <button>View Details</button>
        </a>
      `;
      container.appendChild(card);
    }
  });
}