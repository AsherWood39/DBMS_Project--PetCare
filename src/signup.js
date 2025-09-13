// Simple signup functionality without Firebase
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");
const adopterRadio = document.getElementById("adopter");
const ownerRadio = document.getElementById("owner");

// Handle URL parameters and localStorage for role selection
document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const roleParam = urlParams.get('role');
  
  // Check for pre-selected role from auth.js (localStorage)
  const preSelectedRole = localStorage.getItem('signupRole');
  
  // Priority: URL parameter > localStorage role > no selection
  let selectedRole = roleParam || preSelectedRole;
  
  if (selectedRole) {
    if (selectedRole.toLowerCase() === 'adopter') {
      adopterRadio.checked = true;
      highlightSelectedRole('adopter');
    } else if (selectedRole.toLowerCase() === 'owner') {
      ownerRadio.checked = true;
      highlightSelectedRole('owner');
    }
  } else {
    highlightSelectedRole('none');
  }

  // Add visual feedback when role changes
  const roleRadios = document.querySelectorAll('input[name="role"]');
  roleRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      highlightSelectedRole(this.value.toLowerCase());
    });
  });
});

// Function to highlight the selected role
function highlightSelectedRole(role) {
  const roleContainer = document.querySelector('.role-select');
  const adopterLabel = document.querySelector('label[for="adopter"]');
  const ownerLabel = document.querySelector('label[for="owner"]');
  
  // Reset styles
  adopterLabel.style.fontWeight = 'normal';
  ownerLabel.style.fontWeight = 'normal';
  adopterLabel.style.color = '';
  ownerLabel.style.color = '';
  
  // Highlight selected role
  if (role === 'adopter') {
    adopterLabel.style.fontWeight = 'normal';
  } else if (role === 'owner') {
    ownerLabel.style.fontWeight = 'normal';
  } else if (role === 'none') {
    // No selection - ensure both radio buttons are unchecked
    const adopterRadio = document.getElementById('adopter');
    const ownerRadio = document.getElementById('owner');
    if (adopterRadio) adopterRadio.checked = false;
    if (ownerRadio) ownerRadio.checked = false;
    // Keep default styling (both labels remain normal weight and color)
  }
}

// Create error message div
const errorDiv = document.createElement("div");
errorDiv.className = "error-message";
errorDiv.style.color = "red";
errorDiv.style.marginTop = "10px";
errorDiv.style.fontSize = "14px";
errorDiv.style.textAlign = "center";
errorDiv.style.width = "100%";
errorDiv.style.display = "block";
document.querySelector("form").appendChild(errorDiv);

document.querySelector("form").addEventListener("submit", async function (event) {
  event.preventDefault();
  errorDiv.textContent = "";

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;
  const selectedRole = document.querySelector('input[name="role"]:checked').value;

  // Validation
  if (!name || !email || !password || !confirmPassword) {
    errorDiv.textContent = "All fields are required";
    return;
  }

  if (password !== confirmPassword) {
    errorDiv.textContent = "Passwords do not match";
    return;
  }

  if (password.length < 6) {
    errorDiv.textContent = "Password must be at least 6 characters long";
    return;
  }

  // Email Format Validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errorDiv.textContent = "Please enter a valid email address";
    return;
  }

  try {
    // Show loading state
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = "Signing up...";

    console.log("Creating user account for:", { name, email, role: selectedRole });

    // Simulate signup delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Check if user already exists (simple check)
    const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const userExists = existingUsers.some(user => user.email === email);

    if (userExists) {
      errorDiv.textContent = "An account with this email already exists";
      submitButton.disabled = false;
      submitButton.textContent = originalText;
      return;
    }

    // Create new user account (store locally)
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      role: selectedRole,
      createdAt: new Date().toISOString()
    };

    existingUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));

    console.log("User successfully created:", newUser);

    // Clear form
    event.target.reset();

    // Show success message with role-specific content
    errorDiv.style.color = "green";
    const roleMessage = selectedRole === 'Adopter' 
      ? "Welcome to PetCare! You can now find your perfect pet companion." 
      : "Welcome to PetCare! You can now list your pets for adoption.";
    
    errorDiv.textContent = `Signup successful as ${selectedRole}! ${roleMessage} Redirecting to login...`;
    
    // Store the user's role preference for later use
    localStorage.setItem('userRole', selectedRole);
    
    // Clear the temporary signup role from auth.js
    localStorage.removeItem('signupRole');
    
    setTimeout(() => {
      window.location.href = "login.html";
    }, 3000);

  } catch (error) {
    console.error("Error during signup:", error);
    errorDiv.style.color = "red";
    errorDiv.textContent = "Failed to create account. Please try again";
    
    // Reset button state
    const submitButton = event.target.querySelector('button[type="submit"]');
    submitButton.disabled = false;
    submitButton.textContent = originalText;
  }
});