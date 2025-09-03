import { or } from "@firebase/firestore";
import { createUser } from "../utils/firebase.js";

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

  if (!name || !email || !password || !confirmPassword) {
    errorDiv.textContent = "All fields are required";
    return;
  }

  if (password != confirmPassword) {
    errorDiv.textContent = "Passwords do not match";
    return;
  }

  if (password.length < 6) {
    errorDiv.textContent = "Password must be at least 6 characters long";
    return;
  }

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

    console.log("Creating user with:", { name, email });

    // Create user with all the improved functionality
    const user = await createUser(email, password, name);
    console.log("User successfully created:", user);

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
    
    // Handle specific Firebase errors
    if (error.code === 'auth/email-already-in-use') {
      errorDiv.textContent = "An account with this email already exists";
    } else if (error.code === 'auth/invalid-email') {
      errorDiv.textContent = "Invalid email address";
    } else if (error.code === 'auth/operation-not-allowed') {
      errorDiv.textContent = "Email/password accounts are not enabled";
    } else if (error.code === 'auth/weak-password') {
      errorDiv.textContent = "Password is too weak";
    } else {
      errorDiv.textContent = error.message || "Failed to create account. Please try again";
    }
    
    // Reset button state
    const submitButton = event.target.querySelector('button[type="submit"]');
    submitButton.disabled = false;
    submitButton.textContent = originalText;
  }
});