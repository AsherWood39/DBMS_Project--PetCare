import { getUserData, refreshUserData } from "../utils/api.js";

const API_BASE = window.__API_BASE__ || 'http://localhost:5000';

function qs(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function escapeHtml(s) {
  return (s + '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

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
    form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting...";

      // Collect form data as JSON
      const data = {
  pet_id: petInput.value,
  full_name: document.getElementById("fullName").value,
  age: parseInt(document.getElementById("age").value, 10) || null,
  email: document.getElementById("email").value,
  phone: document.getElementById("phone").value,
  address: document.getElementById("address").value,
  home_type: document.getElementById("homeType").value,
  has_fenced_yard: document.getElementById("yard").value === 'Yes',
  household_members: document.getElementById("householdMembers").value,
  other_pets: document.getElementById("otherPets").value,
  adopted_before: document.getElementById("adoptedBefore").value === 'Yes',
  pet_experience: document.getElementById("petExperience").value,
  dedicated_hours_per_day: parseInt(document.getElementById("dedicatedHours").value, 10) || null,
  willing_medical_care: document.getElementById("medicalCare").value === 'Yes',
  adoption_reason: document.getElementById("adoptReason").value,
  preferences: document.getElementById("preferences").value,
  ready_for_training: document.getElementById("training").value === 'Yes',
  willing_agreement: document.getElementById("agreement").value === 'Yes',
  references_info: document.getElementById("references").value,
  aware_of_fees: document.getElementById("fees").value === 'Yes',
  commitment_promise: document.getElementById("commitment").checked,
  scheduled_visit: document.getElementById("schedule").value || null
};


      try {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/api/adoption-requests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    body: JSON.stringify(data)
  });

  const json = await res.json().catch(() => null);
  if (!res.ok) throw new Error(json?.message || 'Failed to submit');

  // ✅ SUCCESS — show message and redirect
  successMessage.textContent = "Request sent successfully! Redirecting...";
  successMessage.style.display = "block";

  form.reset();

  setTimeout(() => window.location.href = "home.html", 1500);

} catch (err) {
  console.error('submit error', err);
  alert("Failed to send request.");
} finally {
  submitBtn.disabled = false;
  submitBtn.textContent = "Submit";
}
    });}

});
