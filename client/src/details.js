document.addEventListener("DOMContentLoaded", function () {
  const adoptBtn = document.querySelector(".adopt-btn");

  if (adoptBtn) {
    adoptBtn.addEventListener("click", function () {
      // Redirect to adoption page
      window.location.href = "adopt_pet.html";
    });
  }
});
