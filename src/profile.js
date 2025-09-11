// Profile Page JavaScript - Inherits paw generation from main script

document.addEventListener('DOMContentLoaded', function() {
  
  // Load user profile data
  loadUserProfile();
  
  // Initialize authentication state
  initializeProfileAuth();
});

// Profile-specific functionality
function loadUserProfile() {
  // Get current user from localStorage or sessionStorage
  const userFromLocal = localStorage.getItem('currentUser');
  const userFromSession = sessionStorage.getItem('currentUser');
  
  let currentUser = null;
  if (userFromLocal) {
    currentUser = JSON.parse(userFromLocal);
  } else if (userFromSession) {
    currentUser = JSON.parse(userFromSession);
  }
  
  // Update profile information
  if (currentUser) {
    const userName = currentUser.name || currentUser.email.split('@')[0];
    const userEmail = currentUser.email;
    
    // Update profile display elements
    const userNameEl = document.getElementById('user-name');
    const userEmailEl = document.getElementById('user-email');
    
    if (userNameEl) userNameEl.textContent = userName;
    if (userEmailEl) userEmailEl.textContent = userEmail;
    
    // Update input fields
    const displayNameInput = document.getElementById('display-name');
    const displayEmailInput = document.getElementById('display-email');
    
    if (displayNameInput) displayNameInput.value = userName;
    if (displayEmailInput) displayEmailInput.value = userEmail;
    
    // Update theme display
    const currentTheme = localStorage.getItem('darkmode') === 'active' ? 'Dark' : 'Light';
    const themeInput = document.getElementById('current-theme');
    if (themeInput) themeInput.value = currentTheme;
  } else {
    // No user logged in, redirect to login
    console.log('No user logged in, redirecting to login');
    window.location.href = 'login.html';
  }
}

// Ensure authentication state is properly displayed
function initializeProfileAuth() {
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem('simpleAuthState') === 'logged-in' || 
                     sessionStorage.getItem('simpleAuthState') === 'logged-in';
  
  const loggedOutButtons = document.querySelector('.logged-out-buttons');
  const loggedInButtons = document.querySelector('.logged-in-buttons');
  
  if (isLoggedIn) {
    // User is logged in - show logout and profile buttons
    if (loggedOutButtons) loggedOutButtons.style.display = 'none';
    if (loggedInButtons) loggedInButtons.style.display = 'flex';
  } else {
    // User is logged out - show login and signup buttons and redirect
    if (loggedOutButtons) loggedOutButtons.style.display = 'flex';
    if (loggedInButtons) loggedInButtons.style.display = 'none';
    
    // Redirect to login since this is a protected page
    console.log('User not authenticated, redirecting to login');
    window.location.href = '../index.html';
    return;
  }
  
  // Add logout functionality specifically for this page
  const logoutButton = document.getElementById('logout-button');
  if (logoutButton) {
    logoutButton.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Logout button clicked from profile page');
      
      // Clear auth state
      localStorage.removeItem('simpleAuthState');
      localStorage.removeItem('currentUser');
      sessionStorage.removeItem('simpleAuthState');
      sessionStorage.removeItem('currentUser');
      
      // Redirect to home page
      window.location.href = '../index.html';
    });
  }
}

function featurePageNavigate() {
  window.location.href = 'feature.html';
}

function deleteProfile() {
  alert('Delete Profile functionality will be implemented soon!');
  initializeProfileAuth(); // Re-check auth state
}

function editProfile() {
  window.location.href = 'adopt_pet.html';
}