// Shared Authentication State Management
// This handles authentication state across all pages

// Check if user is logged in
function isUserLoggedIn() {
  return localStorage.getItem('simpleAuthState') === 'logged-in' || 
         sessionStorage.getItem('simpleAuthState') === 'logged-in';
}

// Get current user info
function getCurrentUser() {
  const userFromLocal = localStorage.getItem('currentUser');
  const userFromSession = sessionStorage.getItem('currentUser');
  
  if (userFromLocal) {
    return JSON.parse(userFromLocal);
  } else if (userFromSession) {
    return JSON.parse(userFromSession);
  }
  return null;
}

// Update authentication UI across all pages
function updateGlobalAuthUI(isLoggedIn) {
  const loggedOutButtons = document.querySelector('.logged-out-buttons');
  const loggedInButtons = document.querySelector('.logged-in-buttons');
  const roleSelection = document.querySelector('.role-selection');
  const homeLink = document.getElementById('home-link');

  if (isLoggedIn) {
    // User is logged in - show logout and profile buttons
    if (loggedOutButtons) loggedOutButtons.style.display = 'none';
    if (loggedInButtons) loggedInButtons.style.display = 'flex';
    if (roleSelection) roleSelection.style.display = 'none';
    if (homeLink) homeLink.style.display = 'block'; // Show Home link when logged in
  } else {
    // User is logged out - show login and signup buttons
    if (loggedOutButtons) loggedOutButtons.style.display = 'flex';
    if (loggedInButtons) loggedInButtons.style.display = 'none';
    if (roleSelection) roleSelection.style.display = 'flex';
    if (homeLink) homeLink.style.display = 'none'; // Hide Home link when logged out
  }
}

// Logout function
function logout() {
  // Clear all auth state
  localStorage.removeItem('simpleAuthState');
  localStorage.removeItem('currentUser');
  sessionStorage.removeItem('simpleAuthState');
  sessionStorage.removeItem('currentUser');
  
  // Update UI
  updateGlobalAuthUI(false);
  
  console.log('User logged out');
  
  // Redirect to home page if not already there
  if (window.location.pathname !== '/index.html' && !window.location.pathname.endsWith('/')) {
    window.location.href = '../index.html';
  } else {
    window.location.reload();
  }
}

// Set user role for signup process
function setSignupRole(role) {
  if (role) {
    localStorage.setItem('signupRole', role);
  } else {
    localStorage.removeItem('signupRole');
  }
}

// Get the pre-selected signup role
function getSignupRole() {
  return localStorage.getItem('signupRole');
}

// Clear signup role after use
function clearSignupRole() {
  localStorage.removeItem('signupRole');
}

// Handle role selection buttons
function handleRoleSelection() {
  const adopterButton = document.getElementById('adopter-button');
  const ownerButton = document.getElementById('owner-button');
  const headerSignupButton = document.getElementById('signup-button');

  if (adopterButton) {
    adopterButton.addEventListener('click', (e) => {
      e.preventDefault();
      setSignupRole('Adopter');
      window.location.href = 'pages/signup.html';
    });
  }

  if (ownerButton) {
    ownerButton.addEventListener('click', (e) => {
      e.preventDefault();
      setSignupRole('Owner');
      window.location.href = 'pages/signup.html';
    });
  }

  if (headerSignupButton) {
    headerSignupButton.addEventListener('click', (e) => {
      e.preventDefault();
      // Clear any pre-selected role when using header signup
      setSignupRole(null);
      const href = headerSignupButton.querySelector('a')?.href || 'pages/signup.html';
      if (href.startsWith('pages/')) {
        window.location.href = href;
      } else {
        window.location.href = href;
      }
    });
  }
}

// Initialize authentication on any page
function initializeAuth() {
  console.log('Initializing global authentication');
  
  const isLoggedIn = isUserLoggedIn();
  updateGlobalAuthUI(isLoggedIn);
  
  // Initialize role selection handlers
  handleRoleSelection();
  
  // Add logout functionality to any logout button
  const logoutButtons = document.querySelectorAll('#logout-button, .logout-btn');
  logoutButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  });
  
  // Listen for storage changes to sync auth state across tabs
  window.addEventListener('storage', (e) => {
    if (e.key === 'simpleAuthState' || e.key === 'currentUser') {
      const newLoginState = isUserLoggedIn();
      updateGlobalAuthUI(newLoginState);
    }
  });
}

// Auto-initialize when script loads
document.addEventListener('DOMContentLoaded', initializeAuth);
