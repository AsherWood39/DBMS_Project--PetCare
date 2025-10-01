// Signup functionality with API integration
import { registerUser, checkEmailExists, ApiError } from '../utils/api.js';

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");
const adopterRadio = document.getElementById("adopter");
const ownerRadio = document.getElementById("owner");
const ageInput = document.getElementById("age");
const phoneInput = document.getElementById("phone");
const addressInput = document.getElementById("address");

// Real-time email validation
let emailCheckTimeout;
async function validateEmailRealTime() {
  const email = emailInput.value.trim();
  const emailStatus = document.getElementById('email-status') || createEmailStatusDiv();
  
  // Clear previous timeout
  clearTimeout(emailCheckTimeout);
  
  if (!email) {
    emailStatus.textContent = '';
    emailStatus.className = 'email-status';
    return;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    emailStatus.textContent = 'Invalid email format';
    emailStatus.className = 'email-status error';
    return;
  }
  
  // Debounce email check
  emailCheckTimeout = setTimeout(async () => {
    try {
      emailStatus.textContent = 'Checking availability...';
      emailStatus.className = 'email-status checking';
      
      const response = await checkEmailExists(email);
      if (response.data.exists) {
        emailStatus.textContent = 'Email already registered';
        emailStatus.className = 'email-status error';
      } else {
        emailStatus.textContent = 'Email available';
        emailStatus.className = 'email-status success';
      }
    } catch (error) {
      emailStatus.textContent = '';
      emailStatus.className = 'email-status';
    }
  }, 1000);
}

function createEmailStatusDiv() {
  const emailStatus = document.createElement('div');
  emailStatus.id = 'email-status';
  emailStatus.className = 'email-status';
  
  // Add CSS styles
  const style = document.createElement('style');
  style.textContent = `
    .email-status {
      font-size: 12px;
      margin-top: 5px;
      min-height: 16px;
    }
    .email-status.error { color: #f44336; }
    .email-status.success { color: #4CAF50; }
    .email-status.checking { color: #2196F3; }
  `;
  document.head.appendChild(style);
  
  // Insert after email input
  emailInput.parentNode.insertBefore(emailStatus, emailInput.nextSibling);
  return emailStatus;
}

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

  // Add real-time email validation
  if (emailInput) {
    emailInput.addEventListener('input', validateEmailRealTime);
    emailInput.addEventListener('blur', validateEmailRealTime);
  }

  // Add password strength indicator
  if (passwordInput) {
    passwordInput.addEventListener('input', showPasswordStrength);
  }

  // Add password confirmation validation
  if (confirmPasswordInput) {
    confirmPasswordInput.addEventListener('input', validatePasswordConfirmation);
  }
});

// Password strength indicator
function showPasswordStrength() {
  const password = passwordInput.value;
  let strengthIndicator = document.getElementById('password-strength') || createPasswordStrengthDiv();
  
  let strength = 0;
  let feedback = [];

  if (password.length >= 6) strength++;
  else feedback.push('At least 6 characters');

  if (/[a-z]/.test(password)) strength++;
  else feedback.push('Lowercase letter');

  if (/[A-Z]/.test(password)) strength++;
  else feedback.push('Uppercase letter');

  if (/\d/.test(password)) strength++;
  else feedback.push('Number');

  if (/[^a-zA-Z\d]/.test(password)) strength++;
  else feedback.push('Special character');

  const strengthLevels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['#f44336', '#ff9800', '#ffc107', '#4caf50', '#2e7d32'];
  
  strengthIndicator.textContent = password ? 
    `Password Strength: ${strengthLevels[strength] || 'Very Weak'}` : '';
  strengthIndicator.style.color = password ? strengthColors[strength] || '#f44336' : '';
  
  if (feedback.length > 0 && password) {
    strengthIndicator.textContent += ` (Need: ${feedback.join(', ')})`;
  }
}

function createPasswordStrengthDiv() {
  const strengthDiv = document.createElement('div');
  strengthDiv.id = 'password-strength';
  strengthDiv.style.fontSize = '12px';
  strengthDiv.style.marginTop = '5px';
  strengthDiv.style.minHeight = '16px';
  
  passwordInput.parentNode.insertBefore(strengthDiv, passwordInput.nextSibling);
  return strengthDiv;
}

// Password confirmation validation
function validatePasswordConfirmation() {
  const confirmPassword = confirmPasswordInput.value;
  const password = passwordInput.value;
  let confirmIndicator = document.getElementById('password-confirm') || createPasswordConfirmDiv();
  
  if (!confirmPassword) {
    confirmIndicator.textContent = '';
    return;
  }
  
  if (password === confirmPassword) {
    confirmIndicator.textContent = 'Passwords match';
    confirmIndicator.style.color = '#4CAF50';
  } else {
    confirmIndicator.textContent = 'Passwords do not match';
    confirmIndicator.style.color = '#f44336';
  }
}

function createPasswordConfirmDiv() {
  const confirmDiv = document.createElement('div');
  confirmDiv.id = 'password-confirm';
  confirmDiv.style.fontSize = '12px';
  confirmDiv.style.marginTop = '5px';
  confirmDiv.style.minHeight = '16px';
  
  confirmPasswordInput.parentNode.insertBefore(confirmDiv, confirmPasswordInput.nextSibling);
  return confirmDiv;
}

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
  const selectedRole = document.querySelector('input[name="role"]:checked')?.value;
  const age = ageInput ? parseInt(ageInput.value) : null;
  const phone = phoneInput ? phoneInput.value.trim() : null;
  const address = addressInput ? addressInput.value.trim() : null;

  // Client-side validation
  if (!name || !email || !password || !confirmPassword || !selectedRole) {
    errorDiv.textContent = "All required fields must be filled";
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

  // Age validation (if provided)
  if (age && (age < 18 || age > 120)) {
    errorDiv.textContent = "Age must be between 18 and 120 years";
    return;
  }

  // Name validation
  if (name.length < 2) {
    errorDiv.textContent = "Name must be at least 2 characters long";
    return;
  }

  const submitButton = event.target.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;

  try {
    // Show loading state
    submitButton.disabled = true;
    submitButton.textContent = "Creating Account...";
    errorDiv.style.color = "#2196F3";
    errorDiv.textContent = "Checking email availability...";

    // Check if email already exists
    const emailCheck = await checkEmailExists(email);
    if (emailCheck.data.exists) {
      errorDiv.style.color = "red";
      errorDiv.textContent = "An account with this email already exists";
      return;
    }

    // Prepare user data for registration
    const userData = {
      full_name: name,
      email: email,
      pass: password,
      role: selectedRole,
      phone: phone,
      address: address
    };

    // Only include age if it's provided
    if (age && age.trim() !== '') {
      userData.age = age;
    }

    errorDiv.style.color = "#2196F3";
    errorDiv.textContent = "Creating your account...";

    console.log("Creating user account for:", { 
      name, 
      email, 
      role: selectedRole, 
      age, 
      phone: phone ? 'provided' : 'not provided', 
      address: address ? 'provided' : 'not provided' 
    });

    // Call API to register user
    const response = await registerUser(userData);

    console.log("User successfully created:", response.data.user);

    // Clear form
    event.target.reset();
    highlightSelectedRole('none');

    // Show success message with role-specific content
    errorDiv.style.color = "green";
    const roleMessage = selectedRole === 'Adopter' 
      ? "You can now browse and adopt pets!" 
      : "You can now list your pets for adoption!";
    
    errorDiv.textContent = `Welcome to PetCare, ${response.data.user.fullName}! ${roleMessage} Redirecting to home...`;
    
    // Clear the temporary signup role from auth.js
    localStorage.removeItem('signupRole');
    
    // Update auth UI immediately
    if (window.authUtils) {
      window.authUtils.updateGlobalAuthUI(true);
    }
    
    // Redirect to home page since user is now logged in
    setTimeout(() => {
      window.location.href = "/pages/home.html";
    }, 2500);

  } catch (error) {
    console.error("Error during signup:", error);
    
    // Handle different error types
    let errorMessage = "Failed to create account. Please try again.";
    
    if (error instanceof ApiError) {
      switch (error.type) {
        case 'VALIDATION_ERROR':
          errorMessage = error.message || "Please check your input and try again";
          break;
        case 'NETWORK_ERROR':
          errorMessage = "Network error. Please check your connection and try again.";
          break;
        case 'SERVER_ERROR':
          if (error.status === 400) {
            errorMessage = error.data?.message || "Invalid input. Please check your information.";
          } else if (error.status === 409) {
            errorMessage = "An account with this email already exists";
          } else {
            errorMessage = "Server error. Please try again later.";
          }
          break;
        default:
          errorMessage = error.message || "An unexpected error occurred";
      }
    }
    
    errorDiv.style.color = "red";
    errorDiv.textContent = errorMessage;
    
  } finally {
    // Reset button state
    submitButton.disabled = false;
    submitButton.textContent = originalText;
  }
});