document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('category-form');
  const postBtn = document.getElementById('post-btn');
  const categoryCards = document.querySelectorAll('.category-card');

  // Card selection effect and button text update
  categoryCards.forEach(card => {
    card.addEventListener('click', function() {
      categoryCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      // Update button text based on selected category
      const input = card.querySelector('input[type="radio"]');
      if (input && input.value) {
        postBtn.textContent = `Post ${capitalize(input.value)}`;
      }
    });
  });

  // Form submission navigation
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    // Get selected category
    const selected = form.querySelector('input[name="pet-category"]:checked');
    let category = selected ? selected.value : '';
    // Redirect to post_pet page with category as query param
    window.location.href = `post_pet.html?category=${encodeURIComponent(category)}`;
  });

  // Helper to capitalize first letter
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
});