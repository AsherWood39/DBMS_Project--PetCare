import { getUserData, refreshUserData } from "../utils/api.js";

const API_BASE = window.__API_BASE__ || 'http://localhost:5000';

function qs(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function escapeHtml(s) {
  return (s + '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function resolvePetImage(pet_image) {
  // Return default image if no image provided
  if (!pet_image) return "../public/Gemini_Generated_Image_pstd6dpstd6dpstd.png";

  // Check if the image path contains an embedded URL
  if (pet_image.includes('https://') || pet_image.includes('http://')) {
    // Extract the actual URL if it was mistakenly prepended with /uploads/
    const urlMatch = pet_image.match(/(https?:\/\/[^\s]+)/);
    if (urlMatch) {
      console.log('Extracted URL from path:', urlMatch[0]);
      return urlMatch[0];
    }
  }

  // If it's already a clean full URL, return as is
  if (/^(https?:|data:|blob:)/i.test(pet_image)) {
    console.log('Using direct URL:', pet_image);
    return pet_image;
  }

  // Handle default image case
  if (pet_image === 'default-pet.png' || !pet_image.includes('://')) {
    const url = `${API_BASE}/uploads/${pet_image.replace(/^\/+/, "")}`;
    console.log('Using local file path:', url);
    return url;
  }

  // For any other case, return as is
  console.log('Using original path:', pet_image);
  return pet_image;
}

async function loadPetSummary(petId) {
  if (!petId) return;
  try {
    const res = await fetch(`${API_BASE}/api/pets/${encodeURIComponent(petId)}`);
    if (!res.ok) return;
    const json = await res.json();
    if (json.status !== 'success' || !json.data) return;
    const p = json.data;
    const container = document.getElementById('pet-summary');
    if (container) {
      container.innerHTML = `
        <div style="display:flex;gap:12px;align-items:center;">
          <img src="${resolvePetImage(p.pet_image)}"
               alt="${escapeHtml(p.pet_name || 'Pet')}"
               style="width:96px;height:72px;object-fit:cover;border-radius:8px;box-shadow:0 6px 18px rgba(0,0,0,0.25)">
          <div>
            <strong style="font-size:1.1rem">${escapeHtml(p.pet_name || '')}</strong><br>
            <small>${escapeHtml(p.breed || '')} • ${escapeHtml(String(p.age || ''))} years</small>
          </div>
        </div>
      `;
    }
  } catch (e) {
    console.warn('Could not load pet summary', e);
  }
}

function tryPrefillFromProfile() {
  // try localStorage currentUser or sessionStorage
  try {
    const raw = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    if (!raw) return null;
    const user = JSON.parse(raw);
    return {
      fullName: user.fullName || user.full_name || '',
      age: user.age || '',
      email: user.email || '',
      phone: user.phone || user.mobile || '',
      address: user.address || ''
    };
  } catch (e) {
    console.error('Error reading profile data:', e);
    return null;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const petId = qs('pet_id') || qs('pet');
  const petInput = document.getElementById('pet_id');
  if (petInput && petId) petInput.value = petId;

  loadPetSummary(petId);

  const toggle = document.getElementById("useProfile");
  const fullNameField = document.getElementById("fullName");
  const emailField = document.getElementById("email");
  const form = document.getElementById("adoptionForm");
  const successMessage = document.getElementById("successMessage");

  // Fill form fields from stored user data. If no data in storage, try to refresh from server.
  async function fillFromProfile(shouldFill) {
    // Get references to all form fields we want to auto-fill
    const fields = {
      fullName: document.getElementById("fullName"),
      age: document.getElementById("age"),
      email: document.getElementById("email"),
      phone: document.getElementById("phone"),
      address: document.getElementById("address")
    };

    // If toggle is off, clear and unlock all fields
    if (!shouldFill) {
      Object.values(fields).forEach(field => {
        if (field) {
          field.value = "";
          field.readOnly = false;
        }
      });
      return;
    }

    // Try to get user data
    let userData = tryPrefillFromProfile();
    
    // If no data in storage, try to refresh from server
    if (!userData) {
      try {
        const freshData = await refreshUserData();
        if (freshData) {
          userData = {
            fullName: freshData.fullName || freshData.full_name || '',
            age: freshData.age || '',
            email: freshData.email || '',
            phone: freshData.phone || freshData.mobile || '',
            address: freshData.address || ''
          };
        }
      } catch (err) {
        console.error('Failed to refresh user data:', err);
      }
    }

    // If we have user data, fill the fields
    if (userData) {
      Object.entries(fields).forEach(([key, field]) => {
        if (field && userData[key]) {
          field.value = userData[key];
          field.readOnly = true;
        }
      });
    } else {
      alert('No profile data found. Please log in to use this feature or fill the fields manually.');
      if (toggle) toggle.checked = false;
    }
  }

  if (toggle && fullNameField && emailField) {
    toggle.addEventListener("change", (e) => {
      fillFromProfile(e.target.checked);
    });
  }

  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const data = {
        pet_id: 1, // or dynamically fetch this from URL/selection
        full_name: formData.get("fullName"),
        age: Number(formData.get("age")),
        email: formData.get("email"),
        phone: formData.get("phone"),
        address: formData.get("address"),
        home_type: formData.get("homeType"),
        has_fenced_yard: formData.get("yard") === "Yes",
        household_members: formData.get("householdMembers"),
        other_pets: formData.get("otherPets"),
        adopted_before: formData.get("adoptedBefore") === "Yes",
        pet_experience: formData.get("petExperience"),
        dedicated_hours_per_day: Number(formData.get("dedicatedHours")),
        willing_medical_care: formData.get("medicalCare") === "Yes",
        adoption_reason: formData.get("adoptReason"),
        preferences: formData.get("preferences"),
        ready_for_training: formData.get("training") === "Yes",
        willing_agreement: formData.get("agreement") === "Yes",
        references_info: formData.get("references"),
        aware_of_fees: formData.get("fees") === "Yes",
        commitment_promise: formData.get("commitment") ? true : false,
        scheduled_visit: formData.get("schedule") || null
      };

      try {
        const response = await fetch("http://localhost:5000/api/adoption-requests", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token") // if using JWT auth
          },
          body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
          successMessage.style.display = "block";
          form.reset();

          // ⭐ Added: Redirect to home.html after 2 seconds
          setTimeout(() => {
            window.location.href = "home.html";
          }, 2000);
        } else {
          alert("❌ Error: " + result.message);
        }
      } catch (error) {
        console.error("Error submitting adoption request:", error);
        alert("Failed to send request.");
      }
    });
  }
});
