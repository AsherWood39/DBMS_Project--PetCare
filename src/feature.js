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

// Enhanced Theme Toggle Functionality (inherited from main script.js)
document.addEventListener('DOMContentLoaded', function() {
  // Initialize theme functionality
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

  // Generate paw prints background
  generatePawPrints();

  // Wait for Firebase to load then initialize auth features
  setTimeout(() => {
    initializeAuthFeatures();
  }, 1000);
});

// Authentication Features for Feature Page (leveraging existing Firebase system)
function initializeAuthFeatures() {
  console.log('Initializing authentication features for feature page');
  
  // The Firebase module is already loaded via the script tag in HTML
  // It automatically handles auth state changes via the onAuthStateChanged observer
  // We just need to add the logout functionality for this page

  // Add logout functionality
  const logoutButton = document.getElementById('logout-button');
  if (logoutButton) {
    logoutButton.addEventListener('click', async (e) => {
      e.preventDefault();
      console.log('Logout button clicked');
      
      try {
        // Use the global Firebase auth that's already initialized
        if (window.firebase && window.firebase.auth) {
          const auth = window.firebase.auth();
          await auth.signOut();
          console.log('User signed out successfully');
          
          // Redirect to home page after logout
          window.location.href = '../index.html';
        } else {
          console.error('Firebase auth not available');
          // Fallback: redirect to home page anyway
          window.location.href = '../index.html';
        }
      } catch (error) {
        console.error('Error signing out:', error);
        // Redirect to home page even if logout fails
        window.location.href = '../index.html';
      }
    });
  }
}

// Dynamic Paw Print Background Generator (inherited from main script.js)
function generatePawPrints() {
  const pawContainer = document.querySelector('.paw-bg');
  if (!pawContainer) return;

  // Clear existing paw prints (if any)
  pawContainer.innerHTML = '';

  // Configuration for paw prints
  const pawConfig = {
    count: 12, // Number of paw prints
    minSize: 90,
    maxSize: 118,
    minOpacity: 0.08,
    maxOpacity: 0.18,
    imagePath: '../public/paws.png' // Adjusted path for pages subfolder
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
        <button>View Details</button>
      `;
      container.appendChild(card);
    }
  });
}

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
        <a href="details.html?pet=${encodeURIComponent(pet.name)}">
          <button>View Details</button>
        </a>
      `;
      container.appendChild(card);
    }
  });
}