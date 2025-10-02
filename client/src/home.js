// Home page logic: load JSON images, set welcome pic, role-based UI, pet filtering

// Helper: resolve asset path (handles http(s), data:, blob:, and public-root files)
import { getUserData } from "../utils/api";

function resolveAssetPath(p) {
  if (!p) return '';
  if (/^(https?:|data:|blob:)/i.test(p)) return p; // leave absolute or data URIs
  const base = import.meta.env.BASE_URL || '/';
  return base + p.replace(/^\/+/, '');
}

// Fetch image URLs (image_urls.json must be in /public)
fetch(`${import.meta.env.BASE_URL}image_urls.json`)
  .then(r => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  })
  .then(json => {
    const welcomePic = document.getElementById('welcome-pic');
    if (welcomePic && json.main_pic) {
      welcomePic.src = resolveAssetPath(json.main_pic);
    }
  })
  .catch(err => {
    console.warn('Failed to load image_urls.json:', err);
    const welcomePic = document.getElementById('welcome-pic');
    if (welcomePic) {
      welcomePic.src = 'https://via.placeholder.com/400x300?text=Pet+Image';
    }
  });

document.addEventListener('DOMContentLoaded', () => {
  console.log('Current User:', getUserData());

  const userName = document.getElementById('user-name');
  const userData = getUserData();
  if (userName && userData?.fullName) {
    userName.textContent = userData.fullName;
  }

  // Unified role resolution
  function resolveRole() {
    // Direct simple key
    let role = localStorage.getItem('userRole');
    // From currentUser object (rememberMe handling)
    try {
      const remember = localStorage.getItem('rememberMe') === 'true';
      const raw = remember ? localStorage.getItem('currentUser') : sessionStorage.getItem('currentUser');
      if (raw) {
        const user = JSON.parse(raw);
        if (user.role) role = user.role;
      }
    } catch(e) {
      console.warn('Role parse failed', e);
    }
    return role;
  }

  const role = resolveRole();

  const adopterText = document.getElementById('welcome-text-adopter');
  const ownerText = document.getElementById('welcome-text-owner');
  const viewPetsSection = document.getElementById('view-pets');
  const postPetSection = document.getElementById('post-pet-section');

  // Hide all first (defensive)
  adopterText && (adopterText.style.display = 'none');
  ownerText && (ownerText.style.display = 'none');
  viewPetsSection && (viewPetsSection.style.display = 'none');
  postPetSection && (postPetSection.style.display = 'none');

  if (role === 'Owner') {
    ownerText && (ownerText.style.display = 'block');
    postPetSection && (postPetSection.style.display = 'block');
    viewPetsSection && (viewPetsSection.style.display = 'none');
  } else if (role === 'Adopter') {
    adopterText && (adopterText.style.display = 'block');
    viewPetsSection && (viewPetsSection.style.display = 'block');
  } else {
    // Not logged in: show adopter view only (optional)
    adopterText && (adopterText.style.display = 'block');
    viewPetsSection && (viewPetsSection.style.display = 'block');
  }

  // Adjust main action button
  const mainActionBtn = document.getElementById('welcome-adopt-btn');
  if (mainActionBtn) {
    const link = mainActionBtn.querySelector('a');
    if (link) {
      if (role === 'Owner') {
        link.textContent = 'Post a Pet';
        link.href = '#post-pet-section';
      } else {
        link.textContent = 'Adopt a Pet';
        link.href = '#view-pets';
      }
    }
  }

  const pets = [
    { name: 'Bruno', age: '8-12 weeks', breed: 'Labrador', gender: 'Male', type: 'Dog', image: 'pet1.jpg' },
    { name: 'Mittens', age: '2 years', breed: 'Tabby Cat', gender: 'Female', type: 'Cat', image: 'pet2.jpg' },
    { name: 'Rocky', age: '2 years', breed: 'Australian Shepherd', gender: 'Male', type: 'Dog', image: 'pet3.jpg' },
    { name: 'Bella', age: '8 weeks', breed: 'Munchkin', gender: 'Female', type: 'Cat', image: 'pet4.jpg' },
    { name: 'Charlie', age: '1 year', breed: 'Corgi', gender: 'Male', type: 'Dog', image: 'pet5.jpg' },
    { name: 'Luna', age: '2 years', breed: 'Husky', gender: 'Female', type: 'Dog', image: 'pet6.jpg' },
    { name: 'Sunny', age: '3 years', breed: 'White Cockatoo', gender: 'Male', type: 'Bird', image: 'pet7.jpg' },
    { name: 'Coco', age: '12 weeks', breed: 'Cockatiel', gender: 'Female', type: 'Bird', image: 'pet8.jpg' },
    { name: 'Sky', age: '2 years', breed: 'Macaw', gender: 'Male', type: 'Bird', image: 'pet9.jpg' },
    { name: 'Snowy', age: '2.5 years', breed: 'Persian Cat', gender: 'Female', type: 'Cat', image: 'pet10.jpg' }
  ];

  const container = document.getElementById('pets-container');
  const buttons = document.querySelectorAll('#filter-buttons button');

  function displayPets(filter = 'All') {
    if (!container) return;
    container.innerHTML = '';
    pets.forEach(p => {
      if (filter === 'All' || p.type === filter) {
        const card = document.createElement('div');
        card.className = 'pet-card';
        card.innerHTML = `
          <img src="${resolveAssetPath(p.image)}" alt="${p.name}">
          <h3>${p.name}</h3>
          <p>Age: ${p.age}</p>
            <p>Breed: ${p.breed}</p>
            <p>Gender: ${p.gender}</p>
            <a href="/pages/details.html">
              <button>View Details</button>
            </a>
        `;
        container.appendChild(card);
      }
    });
  }

  // Initial load
  displayPets('All');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      displayPets(btn.getAttribute('data-type'));
    });
  });

  const form = document.getElementById('category-form');
  const postBtn = document.getElementById('post-btn');
  const categoryCards = document.querySelectorAll('.category-card');

  categoryCards.forEach(card => {
    card.addEventListener('click', () => {
      categoryCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const input = card.querySelector('input[type="radio"]');
      if (input?.value) postBtn.textContent = `Post ${capitalize(input.value)}`;
    });
  });

  form?.addEventListener('submit', e => {
    e.preventDefault();
    const selected = form.querySelector('input[name="pet-category"]:checked');
    const category = selected ? selected.value : '';
    window.location.href = `post_pet.html?category=${encodeURIComponent(category)}`;
  });

  function capitalize(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
  }
});
