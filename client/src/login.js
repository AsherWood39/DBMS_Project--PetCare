
// Login functionality with API integration
import { loginUser, checkEmailExists, ApiError } from '../utils/api.js';

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");  
const rememberMeCheckbox = document.getElementById("remember");
const errorDiv = document.createElement("div");
errorDiv.className = "error-message";
errorDiv.style.color = "red";
errorDiv.style.textAlign = "center";
errorDiv.style.width = "100%";
errorDiv.style.display = "block";
errorDiv.style.marginTop = "10px";
errorDiv.style.fontSize = "14px";
document.querySelector("form").appendChild(errorDiv);

document.querySelector("form").addEventListener("submit", async function (event) {
  event.preventDefault();
  errorDiv.textContent = "";

  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const rememberMe = rememberMeCheckbox.checked;

  // Client-side validation
  if (!email || !password) {
    errorDiv.textContent = "Email and password are required";
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errorDiv.textContent = "Please enter a valid email address";
    return;
  }

  if (password.length < 6) {
    errorDiv.textContent = "Password must be at least 6 characters long";
    return;
  }

  const submitButton = event.target.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;

  try {
    // Show loading state
    submitButton.disabled = true;
    submitButton.textContent = "Logging in...";
    errorDiv.style.color = "#2196F3";
    errorDiv.textContent = "Authenticating with server...";

    // Call API to login user
    const response = await loginUser({
      email: email,
      pass: password
    }, rememberMe);

    // Login successful
    errorDiv.style.color = "green";
    errorDiv.textContent = `Welcome back, ${response.data.user.fullName}! Redirecting...`;
    
    console.log("User logged in successfully:", response.data.user);
    
    // Update auth UI immediately
    if (window.authUtils) {
      window.authUtils.updateGlobalAuthUI(true);
    }
    
    // Redirect to home page
    setTimeout(() => {
      window.location.href = "/pages/home.html";
    }, 1500);
    
  } catch (error) {
    console.error("Login error:", error);
    
    // Handle different error types
    let errorMessage = "Login failed. Please try again.";
    
    if (error instanceof ApiError) {
      switch (error.type) {
        case 'AUTH_ERROR':
          errorMessage = error.message || "Invalid email or password";
          break;
        case 'VALIDATION_ERROR':
          errorMessage = error.message || "Please check your input";
          break;
        case 'NETWORK_ERROR':
          errorMessage = "Network error. Please check your connection and try again.";
          break;
        case 'SERVER_ERROR':
          if (error.status === 401) {
            errorMessage = "Invalid email or password";
          } else if (error.status === 429) {
            errorMessage = "Too many login attempts. Please try again later.";
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

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errorDiv.style.color = "red";
        errorDiv.textContent = "Please enter a valid email address";
        return;
      }

      try {
        // Check if email exists in the system
        const response = await checkEmailExists(email);
        
        if (response.data.exists) {
          errorDiv.style.color = "green";
          errorDiv.textContent = "If this email is registered, you will receive password reset instructions shortly.";
          console.log(`Password reset would be sent to: ${email}`);
        } else {
          errorDiv.style.color = "green";
          errorDiv.textContent = "If this email is registered, you will receive password reset instructions shortly.";
          // Don't reveal if email exists or not for security reasons
        }
      } catch (error) {
        console.error("Forgot password error:", error);
        errorDiv.style.color = "green";
        errorDiv.textContent = "If this email is registered, you will receive password reset instructions shortly.";
      }
    });
  }
});