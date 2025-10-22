// Home page logic: load JSON images, set welcome pic, role-based UI, pet filtering

import { getUserData } from "../utils/api"; 

const API_BASE = window.__API_BASE__ || "http://localhost:5000";
console.log('API_BASE:', API_BASE);

// ✅ Normalize image paths from backend (fix for /uploads issues)
function resolvePetImage(pet_image) {
  console.log('Resolving image path:', pet_image);

  // Return default image if no image provided
  if (!pet_image) {
    console.log('No image provided, using default');
    return "../public/Gemini_Generated_Image_pstd6dpstd6dpstd.png";
  }

  // Case 1: Handle full URLs (including those mistakenly prefixed with /uploads/)
  if (pet_image.includes('https://') || pet_image.includes('http://')) {
    const urlMatch = pet_image.match(/(https?:\/\/[^\s]+)/);
    if (urlMatch) {
      console.log('Extracted URL from path:', urlMatch[0]);
      return urlMatch[0];
    }
  }

  // Case 2: Clean full URLs that start with proper protocols
  if (/^(https?:|data:|blob:)/i.test(pet_image)) {
    console.log('Using direct URL:', pet_image);
    return pet_image;
  }

  // Case 3: Handle local uploads with or without /uploads/ prefix
  if (pet_image.startsWith('/uploads/')) {
    console.log('Using existing uploads path:', `${API_BASE}${pet_image}`);
    return `${API_BASE}${pet_image}`;
  }

  // Case 4: Handle local filenames that need /uploads/ prefix
  if (!pet_image.includes('://')) {
    // Remove any leading slashes and ensure clean path
    const cleanPath = pet_image.replace(/^\/+/, "");
    const url = `${API_BASE}/uploads/${cleanPath}`;
    console.log('Using local file path:', url);
    return url;
  }

  // Case 5: Default fallback - return as is
  console.log('Using original path:', pet_image);
  return pet_image;
}

// ✅ General asset resolver (for JSON pics etc.)
function resolveAssetPath(p) {
  if (!p) return "";
  if (/^(https?:|data:|blob:)/i.test(p)) return p;
  const base = import.meta.env.BASE_URL || "/";
  return base + p.replace(/^\/+/, "");
}

// Load welcome image
fetch(`${import.meta.env.BASE_URL}image_urls.json`)
  .then((r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  })
  .then((json) => {
    const welcomePic = document.getElementById("welcome-pic");
    if (welcomePic && json.main_pic) {
      welcomePic.src = resolveAssetPath(json.main_pic);
    }
  })
  .catch((err) => {
    console.warn("Failed to load image_urls.json:", err);
    const welcomePic = document.getElementById("welcome-pic");
    if (welcomePic) {
      welcomePic.src = "https://via.placeholder.com/400x300?text=Pet+Image";
    }
  });

document.addEventListener("DOMContentLoaded", () => {
  const userData = getUserData();
  console.log("Current User:", userData);

  // Display user name
  const userName = document.getElementById("user-name");
  if (userName && userData?.fullName) {
    userName.textContent = userData.fullName;
  }

  // Resolve user role from localStorage/sessionStorage
  function resolveRole() {
    let role = localStorage.getItem("userRole");
    try {
      const remember = localStorage.getItem("rememberMe") === "true";
      const raw = remember
        ? localStorage.getItem("currentUser")
        : sessionStorage.getItem("currentUser");
      if (raw) {
        const user = JSON.parse(raw);
        if (user.role) role = user.role;
      }
    } catch (e) {
      console.warn("Role parse failed", e);
    }
    return role;
  }

  const role = resolveRole();

  const adopterText = document.getElementById("welcome-text-adopter");
  const ownerText = document.getElementById("welcome-text-owner");
  const viewPetsSection = document.getElementById("view-pets");
  const postPetSection = document.getElementById("post-pet-section");

  [adopterText, ownerText, postPetSection].forEach(el => {
    if (el) el.style.display = "none";
  });

  if (role === "Owner") {
    if (ownerText) ownerText.style.display = "block";
    if (postPetSection) postPetSection.style.display = "block";
  } else {
    if (adopterText) adopterText.style.display = "block";
    if (viewPetsSection) viewPetsSection.style.display = "block";
  }

  // Adjust main buttons
  const mainActionBtn = document.getElementById("welcome-adopt-btn");
  const learnMoreBtn = document.getElementById("welcome-learn-btn");
  [mainActionBtn, learnMoreBtn].forEach(btn => {
    if (btn) {
      const link = btn.querySelector("a");
      if (link) {
        if (btn.id === "welcome-adopt-btn") {
          link.textContent = role === "Owner" ? "Post a Pet" : "Adopt a Pet";
          link.href = role === "Owner" ? "#post-pet-section" : "#view-pets";
        } else {
          link.href = role === "Owner" ? "#post-pet-section" : "#view-pets";
        }
      }
    }
  });

  let pets = [];
  let currentFilter = "All";

  // Filter buttons
  const buttons = Array.from(document.querySelectorAll("#filter-buttons button") || []);

  // Fetch pets from API
  async function loadPetsFromApi() {
    try {
      const res = await fetch(`${API_BASE}/api/pets`);
      const json = await res.json();
      const petsData = Array.isArray(json.data) ? json.data : [];


      console.log('Raw pet data:', petsData);
      pets = petsData.map((p) => {
        const pet = {
          pet_id: p.pet_id ?? p.id ?? null,
          pet_name: p.pet_name ?? "Unknown",
          breed: p.breed ?? "",
          age: p.age ?? "",
          gender: p.gender ?? "",
          category: p.category ?? "",
          imageUrl: resolvePetImage(p.pet_image),
        };
        console.log('Processed pet data:', pet);
        console.log('Original image path:', p.pet_image);
        console.log('Resolved image URL:', pet.imageUrl);
        return pet;
      });


      displayPets(currentFilter);
    } catch (err) {
      console.error("Failed to load pets:", err);
      const container = document.getElementById("pets-container");
      if (container) container.innerHTML = `<p>Unable to load pets. ${err.message}</p>`;
    }
  }

  function createPetCard(p) {
    const card = document.createElement('div');
    card.className = 'pet-card';

    const img = document.createElement('img');

    console.log('Creating image for pet:', p.pet_name);
    console.log('Image URL before processing:', p.imageUrl);
    
    // First try to use the direct URL
    const imgSrc = /^(https?:|data:|blob:)/i.test(p.imageUrl) 
      ? p.imageUrl 
      : resolvePetImage(p.imageUrl);
    
    console.log('Final image src:', imgSrc);
    
    img.alt = p.pet_name || 'Pet';
    img.width = 360;
    img.height = 180;
    img.loading = 'lazy';

    img.onerror = () => {
      console.warn(`Failed to load image for pet ${p.pet_name}:`, img.src);
      img.onerror = null;
      // Use an absolute path for the fallback image
      const fallbackPath = new URL('../public/Gemini_Generated_Image_pstd6dpstd6dpstd.png', window.location.href).href;
      console.log('Using fallback image path:', fallbackPath);
      img.src = fallbackPath;
    };
    
    // Set src after attaching onerror handler
    img.src = imgSrc;

    const body = document.createElement('div');
    body.className = 'pet-card-body';
    body.innerHTML = `
      <h4>${escapeHtml(p.pet_name)}</h4>
      <p>Age: ${escapeHtml(String(p.age))}</p>
      <p>Breed: ${escapeHtml(p.breed)}</p>
      <p>Gender: ${escapeHtml(p.gender)}</p>
      <a class="view-details-btn" href="details.html?id=${encodeURIComponent(p.pet_id)}">View Details</a>
    `;

    card.appendChild(img);
    card.appendChild(body);

    return card;
  }

  function displayPets(filter = "All") {
    const container = document.getElementById("pets-container");
    if (!container) return;
    container.innerHTML = "";
    pets.forEach((p) => {
      if (filter === "All" || p.category === filter) container.appendChild(createPetCard(p));
    });
  }

  function escapeHtml(s) {
    return (s + "").replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );
  }

  // Initial load
  loadPetsFromApi();

  // Filter buttons click
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.getAttribute("data-type") || "All";
      displayPets(currentFilter);
    });
  });

  // Category selection for post pet
  const form = document.getElementById("category-form");
  const postBtn = document.getElementById("post-btn");
  const categoryCards = document.querySelectorAll(".category-card");

  categoryCards.forEach((card) => {
    card.addEventListener("click", () => {
      categoryCards.forEach((c) => c.classList.remove("selected"));
      card.classList.add("selected");
      const input = card.querySelector('input[type="radio"]');
      if (input?.value) postBtn.textContent = `Post ${capitalize(input.value)}`;
    });
  });

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const selected = form.querySelector('input[name="pet-category"]:checked');
    const category = selected ? selected.value : "";
    window.location.href = `post_pet.html?category=${encodeURIComponent(category)}`;
  });

  function capitalize(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
  }
});
