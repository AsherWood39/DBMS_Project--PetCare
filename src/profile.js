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
  const editButton = document.querySelector('.btn-edit');
  const viewPetsButton = document.querySelector('.btn-view-pets');
  const displayNameInput = document.getElementById('display-name');
  const displayEmailInput = document.getElementById('display-email');
  const themeInput = document.getElementById('current-theme');
  const notificationInput = document.getElementById('notification-settings');
  
  // Check if currently in edit mode
  const isEditMode = editButton.textContent === 'Save';
  
  if (isEditMode) {
    // Save mode - save changes and exit edit mode
    saveProfileChanges();
  } else {
    // Enter edit mode
    enterEditMode();
  }
}

function enterEditMode() {
  // Store original values for cancel functionality
  const displayNameInput = document.getElementById('display-name');
  const displayEmailInput = document.getElementById('display-email');
  const themeInput = document.getElementById('current-theme');
  const notificationInput = document.getElementById('notification-settings');
  
  // Store original values in data attributes
  displayNameInput.dataset.original = displayNameInput.value;
  displayEmailInput.dataset.original = displayEmailInput.value;
  themeInput.dataset.original = themeInput.value;
  notificationInput.dataset.original = notificationInput.value;
  
  // Make inputs editable
  displayNameInput.removeAttribute('readonly');
  displayEmailInput.removeAttribute('readonly');
  themeInput.removeAttribute('readonly');
  notificationInput.removeAttribute('readonly');
  
  // Add edit styling
  displayNameInput.classList.add('editing');
  displayEmailInput.classList.add('editing');
  themeInput.classList.add('editing');
  notificationInput.classList.add('editing');
  
  // Change button text and functionality
  const editButton = document.querySelector('.btn-edit');
  const viewPetsButton = document.querySelector('.btn-view-pets');
  
  editButton.textContent = 'Save';
  editButton.classList.add('btn-save');
  
  viewPetsButton.textContent = 'Cancel';
  viewPetsButton.classList.add('btn-cancel');
  viewPetsButton.setAttribute('onclick', 'cancelEdit()');
}

function saveProfileChanges() {
  const displayNameInput = document.getElementById('display-name');
  const displayEmailInput = document.getElementById('display-email');
  const themeInput = document.getElementById('current-theme');
  const notificationInput = document.getElementById('notification-settings');
  
  // Get current user data
  const userFromLocal = localStorage.getItem('currentUser');
  const userFromSession = sessionStorage.getItem('currentUser');
  
  let currentUser = null;
  let storageType = null;
  
  if (userFromLocal) {
    currentUser = JSON.parse(userFromLocal);
    storageType = 'local';
  } else if (userFromSession) {
    currentUser = JSON.parse(userFromSession);
    storageType = 'session';
  }
  
  if (currentUser) {
    // Update user data
    currentUser.name = displayNameInput.value;
    currentUser.email = displayEmailInput.value;
    
    // Save back to storage
    const userDataString = JSON.stringify(currentUser);
    if (storageType === 'local') {
      localStorage.setItem('currentUser', userDataString);
    } else {
      sessionStorage.setItem('currentUser', userDataString);
    }
    
    // Update display elements
    const userNameEl = document.getElementById('user-name');
    const userEmailEl = document.getElementById('user-email');
    
    if (userNameEl) userNameEl.textContent = currentUser.name;
    if (userEmailEl) userEmailEl.textContent = currentUser.email;
  }
  
  // Exit edit mode
  exitEditMode();
  
  // Show success message
  showMessage('Profile updated successfully!', 'success');
}

function cancelEdit() {
  const displayNameInput = document.getElementById('display-name');
  const displayEmailInput = document.getElementById('display-email');
  const themeInput = document.getElementById('current-theme');
  const notificationInput = document.getElementById('notification-settings');
  
  // Restore original values
  displayNameInput.value = displayNameInput.dataset.original;
  displayEmailInput.value = displayEmailInput.dataset.original;
  themeInput.value = themeInput.dataset.original;
  notificationInput.value = notificationInput.dataset.original;
  
  // Exit edit mode
  exitEditMode();
}

function exitEditMode() {
  const displayNameInput = document.getElementById('display-name');
  const displayEmailInput = document.getElementById('display-email');
  const themeInput = document.getElementById('current-theme');
  const notificationInput = document.getElementById('notification-settings');
  
  // Make inputs readonly again
  displayNameInput.setAttribute('readonly', true);
  displayEmailInput.setAttribute('readonly', true);
  themeInput.setAttribute('readonly', true);
  notificationInput.setAttribute('readonly', true);
  
  // Remove edit styling
  displayNameInput.classList.remove('editing');
  displayEmailInput.classList.remove('editing');
  themeInput.classList.remove('editing');
  notificationInput.classList.remove('editing');
  
  // Restore button text and functionality
  const editButton = document.querySelector('.btn-edit');
  const viewPetsButton = document.querySelector('.btn-view-pets');
  
  editButton.textContent = 'Edit Profile';
  editButton.classList.remove('btn-save');
  
  viewPetsButton.textContent = 'View Pets';
  viewPetsButton.classList.remove('btn-cancel');
  viewPetsButton.setAttribute('onclick', 'featurePageNavigate()');
  
  // Clear stored original values
  displayNameInput.removeAttribute('data-original');
  displayEmailInput.removeAttribute('data-original');
  themeInput.removeAttribute('data-original');
  notificationInput.removeAttribute('data-original');
}

function showMessage(message, type = 'info') {
  // Create message element
  const messageEl = document.createElement('div');
  messageEl.className = `profile-message ${type}`;
  messageEl.textContent = message;
  messageEl.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 5px;
    color: white;
    z-index: 1000;
    font-weight: 500;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    background-color: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
  `;
  
  document.body.appendChild(messageEl);
  
  // Remove after 3 seconds
  setTimeout(() => {
    if (messageEl.parentNode) {
      messageEl.parentNode.removeChild(messageEl);
    }
  }, 3000);
}