document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('postPetForm');
  const categorySelect = document.getElementById("categorySelect");
  const healthDiv = document.getElementById("healthOptions");
  const vaccineDiv = document.getElementById("compulsoryVaccines");

  const API_BASE = window.__API_BASE__ || 'http://localhost:5000';

  // Prefill category from query string
  const prefillCategory = new URLSearchParams(window.location.search).get('category');
  if (prefillCategory && categorySelect) {
    categorySelect.value = prefillCategory.charAt(0).toUpperCase() + prefillCategory.slice(1).toLowerCase();
    categorySelect.dispatchEvent(new Event('change'));
  }

  // Category change listener
  categorySelect.addEventListener("change", () => {
    const selected = categorySelect.value;

    // Health options
    healthDiv.innerHTML = "";
    if (healthOptions[selected]) {
      healthOptions[selected].forEach(opt => {
        const label = document.createElement("label");
        label.innerHTML = `<input type="checkbox" name="${opt.toLowerCase()}"> ${opt}`;
        healthDiv.appendChild(label);
      });
    }

    // Compulsory vaccines
    vaccineDiv.innerHTML = "";
    if (compulsoryVaccines[selected]) {
      compulsoryVaccines[selected].forEach(vac => {
        const div = document.createElement("div");
        div.classList.add("vaccination-entry");
        div.innerHTML = `
          <label><input type="checkbox" name="${vac.toLowerCase()}"> ${vac}</label>
          <input type="file" name="${vac.toLowerCase()}Cert" accept=".jpg,.jpeg,.png,.pdf" required>
        `;
        vaccineDiv.appendChild(div);
      });
    }
  });

  // Extra vaccine add/remove
  document.getElementById("addVaccineBtn").addEventListener("click", () => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("vaccination-entry");
    wrapper.innerHTML = `
      <input type="text" name="extraVaccineName[]" placeholder="Vaccine Name" required>
      <input type="file" name="extraVaccineFile[]" accept=".jpg,.jpeg,.png,.pdf" required>
      <button type="button" class="removeVaccineBtn">❌</button>
    `;
    document.getElementById("extraVaccines").appendChild(wrapper);

    wrapper.querySelector(".removeVaccineBtn").addEventListener("click", () => {
      wrapper.remove();
    });
  });

  // --- SINGLE form submit handler ---
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      // Build FormData so file inputs are included
      const fd = new FormData(form);

      // include auth if you use a token (or use credentials for cookie sessions)
      const token = localStorage.getItem('token');

      const res = await fetch(`${API_BASE}/api/pets`, {
        method: 'POST',
        credentials: 'include', // keeps cookies if your auth uses them
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: fd // DO NOT set Content-Type header when sending FormData
      });

      const body = await res.json().catch(() => null);
      if (!res.ok) {
        console.error('Post pet failed', res.status, body);
        alert(body?.message || 'Failed to post pet');
        return;
      }

      alert('Pet posted successfully');
      form.reset();
      setTimeout(() => window.location.href = "home.html", 1500);
    } catch (err) {
      console.error('submit error', err);
      alert('Submit error: ' + (err.message || err));
    }
  });
});