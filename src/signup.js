// Simple signup functionality without Firebase
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");
const errorDiv = document.createElement("div");
errorDiv.className = "error-message";
errorDiv.style.color = "red";
errorDiv.style.marginTop = "10px";
errorDiv.style.fontSize = "14px";
document.querySelector("form").appendChild(errorDiv);

document.querySelector("form").addEventListener("submit", async function (event) {
  event.preventDefault();
  errorDiv.textContent = "";

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

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

    console.log("Creating user account for:", { name, email });

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
      createdAt: new Date().toISOString()
    };

    existingUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));

    console.log("User successfully created:", newUser);

    // Clear form
    event.target.reset();

    // Show success message and redirect
    errorDiv.style.color = "green";
    errorDiv.textContent = "Signup successful! Redirecting to login...";
    
    setTimeout(() => {
      window.location.href = "../pages/login.html";
    }, 2000);

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