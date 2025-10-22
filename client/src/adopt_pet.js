import { getUserData, refreshUserData } from "../utils/api.js";

const API_BASE = window.__API_BASE__ || 'http://localhost:5000';

function qs(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function escapeHtml(s) {
  return (s + '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
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
          <img src="${escapeHtml(p.pet_image ? (p.pet_image.startsWith('/uploads') ? API_BASE + p.pet_image : API_BASE + '/uploads/' + p.pet_image) : '/assets/default-pet.png')}"
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
      email: user.email || '',
      phone: user.phone || user.mobile || '',
      address: (user.address || '')
    };
  } catch (e) { return null; }
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
    if (!toggle || !fullNameField || !emailField) return;
    if (!shouldFill) {
      fullNameField.value = "";
      emailField.value = "";
      fullNameField.readOnly = false;
      emailField.readOnly = false;
      return;
    }

    let user = getUserData();
    if (!user) {
      try {
        user = await refreshUserData();
      } catch (err) {
        console.error('Failed to refresh user data:', err);
      }
    }

    if (user && (user.fullName || user.email)) {
      fullNameField.value = user.fullName || "";
      emailField.value = user.email || "";
      fullNameField.readOnly = true;
      emailField.readOnly = true;
    } else {
      alert('No profile data found. Please log in to use this feature or fill the fields manually.');
      toggle.checked = false;
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
