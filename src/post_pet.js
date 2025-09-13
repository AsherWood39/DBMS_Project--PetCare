const healthOptions = {
  Dog: ["Dewormed", "Neutered"],
  Cat: ["Dewormed", "Spayed"],
  Bird: ["Clipped Wings", "Dewormed"]
};

const compulsoryVaccines = {
  Dog: ["Rabies", "DHPPi", "Leptospirosis"],
  Cat: ["Rabies", "Feline Distemper", "Calicivirus"],
  Bird: ["Avian Influenza", "Newcastle Disease"]
};

const categorySelect = document.getElementById("categorySelect");
const healthDiv = document.getElementById("healthOptions");
const vaccineDiv = document.getElementById("compulsoryVaccines");

categorySelect.addEventListener("change", () => {
  const selected = categorySelect.value;

  // Update health options
  healthDiv.innerHTML = "";
  if (healthOptions[selected]) {
    healthOptions[selected].forEach(opt => {
      const label = document.createElement("label");
      label.innerHTML = `<input type="checkbox" name="${opt.toLowerCase()}"> ${opt}`;
      healthDiv.appendChild(label);
    });
  }

  // Update compulsory vaccines
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
