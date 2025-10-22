// details.js — Fetch and display single pet details

const API_BASE = window.__API_BASE__ || 'http://localhost:5000'; // set to your backend origin

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

function escapeHtml(s) {
  return (s + '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function escapeSelector(s) {
  return (s + '').replace(/([ #;.?+*~\[\]\(\)'"<>:$=!|\/\\])/g, '\\$1');
}

async function fetchPetDetails() {
  const qs = new URLSearchParams(window.location.search);
  const petId = qs.get('id');
  const container = document.querySelector('.pet-details') || document.querySelector('main');

  if (!petId) {
    if (container) container.innerHTML = '<p class="error">Pet ID missing in URL.</p>';
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/pets/${encodeURIComponent(petId)}`, { credentials: 'include' });

    // Try parse JSON, but if it's HTML log body for diagnosis
    let json;
    try {
      json = await res.json();
    } catch (parseErr) {
      const text = await res.text().catch(() => '<no body>');
      console.error('API returned non-JSON response for details:', { status: res.status, body: text });
      throw new Error(`Invalid JSON response from API (status ${res.status}). See console for body.`);
    }

    if (json.status !== 'success' || !json.data) throw new Error(json.message || 'Pet not found');

    const pet = json.data;
    const imageUrl = resolvePetImage(pet.pet_image);

    // If a form exists (id="pet-form" or data-prefill="true"), prefill it
    const form = document.getElementById('pet-form') || document.querySelector('form[data-prefill="true"]');
    if (form) {
      const fields = ['category','pet_name','breed','age','gender','color','weight','temperament','location','diet_preferences','special_notes'];
      fields.forEach(f => {
        const el = form.querySelector(`[name="${f}"]`);
        if (!el) return;
        if (el.type === 'checkbox') {
          el.checked = Boolean(pet[f]);
        } else if (el.type === 'radio') {
          const radio = form.querySelector(`[name="${f}"][value="${escapeSelector(String(pet[f] ?? ''))}"]`);
          if (radio) radio.checked = true;
        } else {
          el.value = pet[f] ?? '';
        }
      });

      // boolean checkboxes or inputs
      ['is_available','is_adopted'].forEach(b => {
        const el = form.querySelector(`[name="${b}"]`);
        if (!el) return;
        if (el.type === 'checkbox') el.checked = pet[b] === 1 || pet[b] === true || pet[b] === '1' || pet[b] === 'true';
        else el.value = pet[b] ?? '';
      });

      // owner info (read-only if present)
      ['owner_name','owner_phone','owner_email'].forEach(o => {
        const el = form.querySelector(`[name="${o}"]`);
        if (!el) return;
        el.value = pet[o] ?? '';
        if (el.tagName === 'INPUT') el.readOnly = true;
      });

      // image preview (do NOT set file input)
      const preview = form.querySelector('#pet-image-preview') || form.querySelector('.pet-image-preview');
      if (preview) {
        if (preview.tagName === 'IMG') preview.src = imageUrl;
        else preview.style.backgroundImage = `url('${imageUrl}')`;
      }

      // show a small note near file input
      const fileInput = form.querySelector('input[type="file"][name="pet_image"]');
      if (fileInput) {
        let note = form.querySelector('.pet-image-note');
        if (!note) {
          note = document.createElement('div');
          note.className = 'pet-image-note';
          fileInput.parentNode.insertBefore(note, fileInput.nextSibling);
        }
        note.textContent = pet.pet_image ? 'Current image shown in preview. Uploading a new file will replace it.' : 'No image uploaded';
      }

      return; // done prefilling
    }

    // Fallback: render read-only details into container
    const html = `
      <div class="pet-detail">
        <div class="pet-detail-grid">
          <div class="pet-image-col">
            <img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(pet.pet_name || 'Pet')}" class="pet-detail-img" onerror="this.src='${API_BASE || ''}/uploads/default-pet.png'">
          </div>

          <div class="pet-info-col">
            <h1>${escapeHtml(pet.pet_name || 'Unknown')}</h1>

            <ul class="pet-summary">
              <li><strong>Breed:</strong> ${escapeHtml(pet.breed || '—')}</li>
              <li><strong>Age:</strong> ${escapeHtml(String(pet.age ?? '—'))}</li>
              <li><strong>Gender:</strong> ${escapeHtml(pet.gender || '—')}</li>
              <li><strong>Color:</strong> ${escapeHtml(pet.color || '—')}</li>
              <li><strong>Weight:</strong> ${escapeHtml(pet.weight ? pet.weight + ' kg' : '—')}</li>
              <li><strong>Temperament:</strong> ${escapeHtml(pet.temperament || '—')}</li>
            </ul>

            <div class="section-title"><span class="icon">📍</span><span>Location</span></div>
            <p>${escapeHtml(pet.location || 'Unknown')}</p>

            <div class="section-title"><span class="icon">🧑‍🦳</span><span>Previous Owner</span></div>
            <div class="owner-block">
              <p><strong>Name:</strong> ${escapeHtml(pet.owner_name || '—')}</p>
              <p><strong>Contact:</strong> ${escapeHtml(pet.owner_phone || '—')}</p>
              <p><strong>Email:</strong> ${escapeHtml(pet.owner_email || '—')}</p>
            </div>

            <div class="section-title"><span class="icon">❤️</span><span>Health Records</span></div>
            <ul>
              <!-- Example health items; replace or render actual fields if available -->
              <li>✅ Vaccinated</li>
              <li>✅ Dewormed</li>
              <li>✅ Neutered</li>
            </ul>

            <div class="section-title"><span class="icon">🍖</span><span>Diet Preferences</span></div>
            <p>${escapeHtml(pet.diet_preferences || 'Not specified')}</p>

            <div class="section-title"><span class="icon">⚠</span><span>Special Notes</span></div>
            <div class="special-notes">${escapeHtml(pet.special_notes || 'None')}</div>

            <a class="request-adoption" href="adopt_pet.html?pet_id=${encodeURIComponent(pet.pet_id)}">Request Adoption</a>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
  } catch (err) {
    console.error('Error fetching pet details:', err);
    if (container) container.innerHTML = `<p class="error">Failed to load pet details: ${escapeHtml(err.message)}</p>`;
  }
}

document.addEventListener('DOMContentLoaded', fetchPetDetails);
