document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('postPetForm');
  const categorySelect = document.getElementById("categorySelect");
  const healthDiv = document.getElementById("healthOptions");
  const vaccineDiv = document.getElementById("compulsoryVaccines");

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
  const formData = new FormData(form); // automatically includes all inputs & files

  // Add static fields
  formData.append('owner_id', 1);
  formData.append('is_available', true);
  formData.append('is_adopted', false);

  // Append extra vaccine files
  document.querySelectorAll('.vaccination-entry').forEach((entry, index) => {
    const fileInput = entry.querySelector('input[type="file"]');
    const textInput = entry.querySelector('input[type="text"]');
    if (fileInput && fileInput.files.length > 0 && textInput) {
      formData.append(`extraVaccines[${index}][name]`, textInput.value);
      formData.append(`extraVaccines[${index}][file]`, fileInput.files[0]);
    }
  });

  try {
    const token = localStorage.getItem('token'); // GET the token here

    const res = await fetch('http://localhost:5000/api/pets', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}` // <-- add token here
      },
      body: formData
    });

    const data = await res.json();
    alert(data.message);
  } catch (err) {
    console.error(err);
    alert('Error posting pet');
  }
});

});
