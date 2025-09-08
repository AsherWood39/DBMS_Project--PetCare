// Dummy user data (replace with backend integration later)
const dummyUser = {
  email: "john@example.com",
  password: "123456",
  name: "John Doe"
};

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

  // Simulate loading state
  const submitButton = event.target.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;
  submitButton.disabled = true;
  submitButton.textContent = "Logging in...";

  setTimeout(() => {
    if (email === dummyUser.email && password === dummyUser.password) {
      // Successful login
      errorDiv.style.color = "green";
      errorDiv.textContent = "Login successful! Redirecting...";

      if (rememberMe) {
        localStorage.setItem("loggedInUser", JSON.stringify(dummyUser));
      } else {
        sessionStorage.setItem("loggedInUser", JSON.stringify(dummyUser));
      }

      setTimeout(() => {
        window.location.href = "../pages/feature.html";
      }, 2000);
    } else {
      // Failed login
      errorDiv.style.color = "red";
      errorDiv.textContent = "Invalid email or password";
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  }, 1000); // simulate server delay
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

      if (email === dummyUser.email) {
        errorDiv.style.color = "green";
        errorDiv.textContent = "Password reset link sent to your email (simulated).";
      } else {
        errorDiv.style.color = "red";
        errorDiv.textContent = "No user found with this email address";
      }
    });
  }
});
