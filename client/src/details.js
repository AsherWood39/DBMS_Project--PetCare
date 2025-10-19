// details.js — Fetch and display single pet details

const API_BASE = window.__API_BASE__ || '';

function resolvePetImage(pet_image) {
  if (!pet_image) return `${API_BASE}/uploads/default-pet.png`;
  if (/^(https?:|data:|blob:)/i.test(pet_image)) return pet_image;
  if (pet_image.startsWith('/uploads')) return `${API_BASE}${pet_image}`;
  return `${API_BASE}/uploads/${pet_image.replace(/^\/+/, '')}`;
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
    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      throw new Error(`Server returned ${res.status}: ${txt}`);
    }

    const json = await res.json();
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
      <section class="pet-detail">
        <div class="pet-detail-grid">
          <div class="pet-image-col">
            <img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(pet.pet_name || 'Pet')}" class="pet-detail-img" onerror="this.src='${API_BASE || ''}/uploads/default-pet.png'">
          </div>
          <div class="pet-info-col">
            <h1>${escapeHtml(pet.pet_name || 'Unknown')}</h1>
            <p><strong>Category:</strong> ${escapeHtml(pet.category || '')}</p>
            <p><strong>Breed:</strong> ${escapeHtml(pet.breed || '')}</p>
            <p><strong>Age:</strong> ${escapeHtml(String(pet.age ?? ''))}</p>
            <p><strong>Gender:</strong> ${escapeHtml(pet.gender || '')}</p>
            <p><strong>Color:</strong> ${escapeHtml(pet.color || '')}</p>
            <p><strong>Weight:</strong> ${escapeHtml(pet.weight ? pet.weight + ' kg' : '')}</p>
            <p><strong>Temperament:</strong> ${escapeHtml(pet.temperament || '')}</p>
            <p><strong>Location:</strong> ${escapeHtml(pet.location || '')}</p>
            <p><strong>Diet:</strong> ${escapeHtml(pet.diet_preferences || '')}</p>
            <p><strong>Notes:</strong> ${escapeHtml(pet.special_notes || '')}</p>
            <p><strong>Available:</strong> ${pet.is_available ? 'Yes' : 'No'}</p>
            <p><strong>Adopted:</strong> ${pet.is_adopted ? 'Yes' : 'No'}</p>

            <h3>Owner / Contact</h3>
            <p><strong>Name:</strong> ${escapeHtml(pet.owner_name || '')}</p>
            <p><strong>Phone:</strong> ${escapeHtml(pet.owner_phone || '')}</p>
            <p><strong>Email:</strong> ${escapeHtml(pet.owner_email || '')}</p>

            <a class="back-btn" href="index.html">← Back to Pets</a>
          </div>
        </div>
      </section>
    `;

    container.innerHTML = html;
  } catch (err) {
    console.error('Error fetching pet details:', err);
    if (container) container.innerHTML = `<p class="error">Failed to load pet details: ${escapeHtml(err.message)}</p>`;
  }
}

document.addEventListener('DOMContentLoaded', fetchPetDetails);
