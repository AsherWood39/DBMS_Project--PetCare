// Home page logic: load JSON images, set welcome pic, role-based UI, pet filtering

import { getUserData } from "../utils/api";

const API_BASE = window.__API_BASE__ || "http://localhost:5000";

// ✅ Normalize image paths from backend (fix for /uploads issues)
function resolvePetImage(pet_image) {
  if (!pet_image) return "../assets/labrador.jpg";
  if (/^(https?:|data:|blob:)/i.test(pet_image)) return pet_image;

  // Handle already-correct paths
  if (pet_image.startsWith("/uploads")) {
    return `${API_BASE}${pet_image}`;
  }

  // If backend accidentally sent filename only (no /uploads prefix)
  return `${API_BASE}/uploads/${pet_image.replace(/^\/+/, "")}`;
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
  console.log("Current User:", getUserData());

  const userName = document.getElementById("user-name");
  const userData = getUserData();
  if (userName && userData?.fullName) {
    userName.textContent = userData.fullName;
  }

  // Resolve role (from localStorage/sessionStorage)
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

  adopterText && (adopterText.style.display = "none");
  ownerText && (ownerText.style.display = "none");
  viewPetsSection && (viewPetsSection.style.display = "none");
  postPetSection && (postPetSection.style.display = "none");

  if (role === "Owner") {
    ownerText && (ownerText.style.display = "block");
    postPetSection && (postPetSection.style.display = "block");
  } else {
    adopterText && (adopterText.style.display = "block");
    viewPetsSection && (viewPetsSection.style.display = "block");
  }

  // Adjust main button
  const mainActionBtn = document.getElementById("welcome-adopt-btn");
  if (mainActionBtn) {
    const link = mainActionBtn.querySelector("a");
    if (link) {
      if (role === "Owner") {
        link.textContent = "Post a Pet";
        link.href = "#post-pet-section";
      } else {
        link.textContent = "Adopt a Pet";
        link.href = "#view-pets";
      }
    }
  }

  const learnMoreBtn = document.getElementById("welcome-learn-btn");
  if (learnMoreBtn) {
    const link = learnMoreBtn.querySelector("a");
    if (link) {
      link.href = role === "Owner" ? "#post-pet-section" : "#view-pets";
    }
  }

  let pets = [];
  let currentFilter = "All";
  const filterButtonsNodeList = document.querySelectorAll("#filter-buttons button");
  const buttons = filterButtonsNodeList ? Array.from(filterButtonsNodeList) : [];

  // ✅ Fetch pets
  async function loadPetsFromApi() {
    try {
      const res = await fetch(`${API_BASE}/api/pets`);
      const json = await res.json();
      const petsData = Array.isArray(json.data) ? json.data : [];

      pets = petsData.map((p) => ({
        pet_id: p.pet_id ?? p.id ?? null,
        pet_name: p.pet_name ?? "Unknown",
        breed: p.breed ?? "",
        age: p.age ?? "",
        gender: p.gender ?? "",
        category: p.category ?? "",
        imageUrl: resolvePetImage(p.pet_image),
      }));

      displayPets(currentFilter);
    } catch (err) {
      console.error("Failed to load pets:", err);
      const container = document.getElementById("pets-container");
      if (container)
        container.innerHTML = `<p>Unable to load pets. ${err.message}</p>`;
    }
  }

  function createPetCard(p) {
    const card = document.createElement('div');
    card.className = 'pet-card';

    // create image element with reserved size + lazy loading + onerror fallback
    const img = document.createElement('img');
    img.src = p.imageUrl || '../assets/labrador.jpg';
    img.alt = p.pet_name || 'Pet';
    img.width = 360;          // give intrinsic width/height to avoid layout shift
    img.height = 180;
    img.loading = 'lazy';
    img.onerror = () => {
      img.onerror = null;
      img.src = '../assets/labrador.jpg';
    };

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
      if (filter === "All" || p.category === filter) {
        container.appendChild(createPetCard(p));
      }
    });
  }

  function escapeHtml(s) {
    return (s + "").replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );
  }

  // Initial load
  loadPetsFromApi();

  // Filters
  if (buttons.length) {
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        buttons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        currentFilter = btn.getAttribute("data-type") || "All";
        displayPets(currentFilter);
      });
    });
  }

  const form = document.getElementById("category-form");
  const postBtn = document.getElementById("post-btn");
  const categoryCards = document.querySelectorAll(".category-card");

  categoryCards.forEach((card) => {
    card.addEventListener("click", () => {
      categoryCards.forEach((c) => c.classList.remove("selected"));
      card.classList.add("selected");
      const input = card.querySelector('input[type="radio"]');
      if (input?.value)
        postBtn.textContent = `Post ${capitalize(input.value)}`;
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
