import { loginInUser, sendPasswordReset } from "../utils/firebase.js";

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");  
const rememberMeCheckbox = document.getElementById("remember");
const errorDiv = document.createElement("div");
errorDiv.className = "error-message";
errorDiv.style.color = "red";
errorDiv.style.marginTop = "10px";
errorDiv.style.fontSize = "14px";
document.querySelector("form").appendChild(errorDiv);

document.querySelector("form").addEventListener("submit", async function (event) {
  event.preventDefault();
  errorDiv.textContent = "";

  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const rememberMe = rememberMeCheckbox.checked;

  if (!email || !password) {
    errorDiv.textContent = "Email and password are required";
    return;
  }

  try {
    // Show loading state
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = "Logging in...";

    // Sign in user with improved functionality
    await loginInUser(email, password, rememberMe);

    // Redirect to home page
    errorDiv.style.color = "green";
    errorDiv.textContent = "Login successful! Redirecting...";
    setTimeout(() => {
      window.location.href = "../pages/feature.html";
    }, 2000);
  } catch (error) {
    console.error("Login error:", error);
    errorDiv.style.color = "red";
    
    if (error.code === 'auth/user-not-found') {
      errorDiv.textContent = "No user found with this email address";
    } else if (error.code === 'auth/wrong-password') {
      errorDiv.textContent = "Incorrect password";
    } else if (error.code === 'auth/invalid-email') {
      errorDiv.textContent = "Invalid email address";
    } else if (error.code === 'auth/too-many-requests') {
      errorDiv.textContent = "Too many failed attempts. Please try again later";
    } else {
      errorDiv.textContent = error.message || "Login failed. Please try again";
    }
    
    // Reset button state
    const submitButton = event.target.querySelector('button[type="submit"]');
    submitButton.disabled = false;
    submitButton.textContent = originalText;
  }
});

// Handle forgot password
document.addEventListener('DOMContentLoaded', function() {
  const forgotPasswordLink = document.querySelector('a[href="#"]');
  if (forgotPasswordLink?.textContent?.includes('Forgot Password')) {
    forgotPasswordLink.addEventListener("click", async (e) => {
      e.preventDefault();
      const email = emailInput.value.trim();

      if (!email) {
        errorDiv.style.color = "red";
        errorDiv.textContent = "Please enter your email address first";
        return;
      }

      try {
        await sendPasswordReset(email);
        errorDiv.style.color = "green";
        errorDiv.textContent = "Password reset email sent! Please check your inbox.";
      } catch (error) {
        console.error("Password reset error:", error);
        errorDiv.style.color = "red";
        if (error.code === 'auth/user-not-found') {
          errorDiv.textContent = "No user found with this email address";
        } else {
          errorDiv.textContent = error.message || "Failed to send reset email";
        }
      }
    });
  }
});