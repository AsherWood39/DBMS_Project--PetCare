document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("useProfile");
  const fullNameField = document.getElementById("fullName");
  const emailField = document.getElementById("email");
  const form = document.getElementById("adoptionForm");
  const successMessage = document.getElementById("successMessage");

  const loggedInUser = {
    fullName: "John Doe",
    email: "john@example.com"
  };

  if (toggle && fullNameField && emailField) {
    toggle.addEventListener("change", () => {
      if (toggle.checked) {
        fullNameField.value = loggedInUser.fullName;
        emailField.value = loggedInUser.email;
        fullNameField.readOnly = true;
        emailField.readOnly = true;
      } else {
        fullNameField.value = "";
        emailField.value = "";
        fullNameField.readOnly = false;
        emailField.readOnly = false;
      }
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
