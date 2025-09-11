const loggedInUser = {
  fullName: "John Doe",
  email: "john@example.com"
};

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("useProfile");
  const fullNameField = document.getElementById("fullName");
  const emailField = document.getElementById("email");
  const successMessage = document.getElementById("successMessage");
  const form = document.getElementById("adoptionForm"); // ✅ define form

  if (toggle && fullNameField && emailField) {
    toggle.addEventListener("change", () => {
      if (toggle.checked) {
        // Prefill values
        fullNameField.value = loggedInUser.fullName;
        emailField.value = loggedInUser.email;

        // Optional: make fields read-only
        fullNameField.readOnly = true;
        emailField.readOnly = true;
      } else {
        // Clear values and allow editing
        fullNameField.value = "";
        emailField.value = "";
        fullNameField.readOnly = false;
        emailField.readOnly = false;
      }
    });
  }

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault(); // prevent page reload

      // (Later) send data to backend here
      console.log("Form submitted");

      // Show success message
      successMessage.style.display = "block";

      // Optionally clear form (except prefilled profile info)
      form.reset();

      // If toggle is still checked, re-apply profile info
      if (toggle && toggle.checked) {
        fullNameField.value = loggedInUser.fullName;
        emailField.value = loggedInUser.email;
        fullNameField.readOnly = true;
        emailField.readOnly = true;
      }
    });
  }
});
