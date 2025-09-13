
// Simple login functionality without Firebase
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");  
const rememberMeCheckbox = document.getElementById("remember");
const errorDiv = document.createElement("div");
errorDiv.className = "error-message";
errorDiv.style.color = "red";
errorDiv.style.marginTop = "10px";
errorDiv.style.fontSize = "14px";
document.querySelector("form").appendChild(errorDiv);

// Simple user credentials for demo (in real app, this would be server-side)
const demoUsers = [
  { email: "user@petcare.com", password: "123456", name: "Demo User" },
  { email: "admin@petcare.com", password: "admin123", name: "Admin User" },
  { email: "test@test.com", password: "test123", name: "Test User" }
];

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

    // Simulate login delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check credentials - accept any valid email and any password with at least 6 characters
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
      errorDiv.textContent = "Please enter a valid email address";
      submitButton.disabled = false;
      submitButton.textContent = originalText;
      return;
    }
    
    if (password.length < 6) {
      errorDiv.textContent = "Password must be at least 6 characters long";
      submitButton.disabled = false;
      submitButton.textContent = originalText;
      return;
    }
    
    // Login successful - accept any valid email and 6+ character password
    const user = { email: email, name: email.split('@')[0] }; // Use email prefix as name
    
    // Store simple auth state
    if (rememberMe) {
      localStorage.setItem('simpleAuthState', 'logged-in');
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      sessionStorage.setItem('simpleAuthState', 'logged-in');
      sessionStorage.setItem('currentUser', JSON.stringify(user));
    }

    // Show success and redirect
    errorDiv.style.color = "green";
    errorDiv.textContent = "Login successful! Redirecting...";
    
    setTimeout(() => {
      window.location.href = "../pages/profile.html";
    }, 1500);
    
    // Reset button state
    submitButton.disabled = false;
    submitButton.textContent = originalText;
    
  } catch (error) {
    console.error("Login error:", error);
    errorDiv.textContent = "Login failed. Please try again";
    
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
    forgotPasswordLink.addEventListener("click", (e) => {
      e.preventDefault();
      const email = emailInput.value.trim();

      if (!email) {
        errorDiv.style.color = "red";
        errorDiv.textContent = "Please enter your email address first";
        return;
      }

      // Simulate password reset
      errorDiv.style.color = "green";
      errorDiv.textContent = "Password reset instructions sent! (Demo mode - check console)";
      console.log(`Password reset would be sent to: ${email}`);
    });
  }
});