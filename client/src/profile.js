// Profile Page JavaScript - Enhanced with proper error handling and validation

// Import API functions
import { getCurrentUser, getUserProfile, updateUserProfile, isAuthenticated, deleteUserAccount } from '../utils/api.js';

// Constants
const STORAGE_KEYS = {
  AUTH_STATE: 'simpleAuthState',
  CURRENT_USER: 'currentUser',
  DARK_MODE: 'darkmode'
};

const AUTH_STATES = {
  LOGGED_IN: 'logged-in',
  LOGGED_OUT: 'logged-out'
};

const MESSAGE_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info'
};

const ELEMENT_IDS = {
  USER_NAME: 'user-name',
  USER_EMAIL: 'user-email',
  USER_AGE: 'user-age',
  USER_PHONE: 'user-phone',
  USER_ADDRESS: 'user-address',
  DISPLAY_NAME: 'display-name',
  DISPLAY_EMAIL: 'display-email',
  DISPLAY_AGE: 'age',
  DISPLAY_PHONE: 'phone-number',
  DISPLAY_ADDRESS: 'address',
  CURRENT_THEME: 'current-theme',
  LOGOUT_BUTTON: 'logout-button'
};

// Utility Functions
function getUserFromStorage() {
  try {
    const localUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    const sessionUser = sessionStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    
    if (localUser) {
      return JSON.parse(localUser);
    }
    if (sessionUser) {
      return JSON.parse(sessionUser);
    }
    return null;
  } catch (error) {
    console.error('Error parsing user data from storage:', error);
    showMessage('Error loading user data. Please log in again.', MESSAGE_TYPES.ERROR);
    return null;
  }
}

function saveUserToStorage(user) {
  try {
    const userString = JSON.stringify(user);
    // Determine which storage was originally used
    if (localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, userString);
    } else {
      sessionStorage.setItem(STORAGE_KEYS.CURRENT_USER, userString);
    }
    return true;
  } catch (error) {
    console.error('Error saving user data to storage:', error);
    showMessage('Error saving profile data.', MESSAGE_TYPES.ERROR);
    return false;
  }
}

function isUserLoggedIn() {
  return localStorage.getItem(STORAGE_KEYS.AUTH_STATE) === AUTH_STATES.LOGGED_IN ||
         sessionStorage.getItem(STORAGE_KEYS.AUTH_STATE) === AUTH_STATES.LOGGED_IN;
}

function validateUserData(user) {
  const errors = [];
  
  if (!user.name || !user.name.trim()) {
    errors.push('Name is required');
  }
  
  if (!user.email || !user.email.trim()) {
    errors.push('Email is required');
  } else if (!isValidEmail(user.email)) {
    errors.push('Please enter a valid email address');
  }

  if (user.age && (isNaN(user.age) || user.age < 18 || user.age > 100)) {
    errors.push('Please enter a valid age (18-100)');
  }
  
  return errors;
}

function validateProfileData(profileData) {
  const errors = [];
  
  if (!profileData.full_name || !profileData.full_name.trim()) {
    errors.push('Name is required');
  }
  
  if (!profileData.email || !profileData.email.trim()) {
    errors.push('Email is required');
  } else if (!isValidEmail(profileData.email)) {
    errors.push('Please enter a valid email address');
  }

  if (profileData.age && (isNaN(profileData.age) || profileData.age < 18 || profileData.age > 100)) {
    errors.push('Please enter a valid age (18-100)');
  }
  
  return errors;
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
}

function updateElementText(elementId, text) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = text;
  }
}

function updateElementValue(elementId, value) {
  const element = document.getElementById(elementId);
  if (element) {
    element.value = value;
  }
}

function clearStorage() {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  sessionStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  localStorage.removeItem(STORAGE_KEYS.AUTH_STATE);
  sessionStorage.removeItem(STORAGE_KEYS.AUTH_STATE);
}

// DOM Initialization
document.addEventListener('DOMContentLoaded', () => {
  loadUserProfile();
  initializeProfileAuth();
  wireProfileButtons();
});

function wireProfileButtons() {
  const editBtn = document.querySelector('.btn-edit');
  const deleteBtn = document.querySelector('.btn-delete');
  const cancelBtn = document.querySelector('.btn-cancel');

  if (editBtn && !editBtn.__wired) {
    editBtn.addEventListener('click', (e) => {
      e.preventDefault();
      enterEditMode();
    });
    editBtn.__wired = true;
  }

  if (deleteBtn && !deleteBtn.__wired) {
    deleteBtn.addEventListener('click', (e) => {
      e.preventDefault();
      deleteProfile();
    });
    deleteBtn.__wired = true;
  }

  if (cancelBtn && !cancelBtn.__wired) {
    cancelBtn.addEventListener('click', (e) => {
      e.preventDefault();
      cancelEdit();
    });
    cancelBtn.__wired = true;
  }
}

// ---- Load User Profile ----
async function loadUserProfile() {
  // Check if user is authenticated
  if (!isAuthenticated()) {
    showMessage('Please log in to view your profile.', MESSAGE_TYPES.ERROR);
    setTimeout(() => {
      window.location.href = '/pages/login.html';
    }, 1500);
    return;
  }

  try {
    // Show loading state
    showMessage('Loading your profile...', MESSAGE_TYPES.INFO);

    // Fetch current user data from server
    const response = await getCurrentUser();
    console.log('Current User Response:', response);
    
    if (response.status === 'success' && response.data.user) {
      const user = response.data.user;
      
      // Extract and sanitize user data
      const userName = sanitizeInput(user.fullName) || 
                       (user.email ? user.email.split('@')[0] : 'User');
      const userEmail = sanitizeInput(user.email) || '';
      const userAge = sanitizeInput(user.age?.toString()) || '';
      const userPhone = sanitizeInput(user.phone) || '';
      const userAddress = sanitizeInput(user.address) || '';

      // Update display elements
      updateElementText(ELEMENT_IDS.USER_NAME, userName);
      updateElementText(ELEMENT_IDS.USER_EMAIL, userEmail);
      updateElementText(ELEMENT_IDS.USER_AGE, userAge);
      updateElementText(ELEMENT_IDS.USER_PHONE, userPhone);
      updateElementText(ELEMENT_IDS.USER_ADDRESS, userAddress);

      // Update input elements
      updateElementValue(ELEMENT_IDS.DISPLAY_NAME, userName);
      updateElementValue(ELEMENT_IDS.DISPLAY_EMAIL, userEmail);
      updateElementValue(ELEMENT_IDS.DISPLAY_AGE, userAge);
      updateElementValue(ELEMENT_IDS.DISPLAY_PHONE, userPhone);
      updateElementValue(ELEMENT_IDS.DISPLAY_ADDRESS, userAddress);

      // Clear loading message
      clearMessage();
      
      console.log('Profile loaded successfully:', user);
    } else {
      throw new Error('Failed to load user profile');
    }
  } catch (error) {
    console.error('Error loading profile:', error);
    showMessage('Failed to load profile. Please try again.', MESSAGE_TYPES.ERROR);
    
    // If it's an authentication error, redirect to login
    if (error.status === 401) {
      setTimeout(() => {
        window.location.href = '/pages/login.html';
      }, 2000);
    }
  }

  // Update theme
  const themeInput = document.getElementById(ELEMENT_IDS.CURRENT_THEME);
  if (themeInput) {
    const currentTheme = localStorage.getItem(STORAGE_KEYS.DARK_MODE) === 'active' ? 'Dark' : 'Light';
    themeInput.value = currentTheme;
  }
}

// ---- Authentication State ----
function initializeProfileAuth() {
  const isLoggedIn = isUserLoggedIn();

  const loggedOutButtons = document.querySelector('.logged-out-buttons');
  const loggedInButtons = document.querySelector('.logged-in-buttons');

  if (isLoggedIn) {
    if (loggedOutButtons) loggedOutButtons.style.display = 'none';
    if (loggedInButtons) loggedInButtons.style.display = 'flex';
  } else {
    if (loggedOutButtons) loggedOutButtons.style.display = 'flex';
    if (loggedInButtons) loggedInButtons.style.display = 'none';
    showMessage('Authentication required. Redirecting to login...', MESSAGE_TYPES.INFO);
    setTimeout(() => {
      window.location.href = '/index.html';
    }, 1500);
    return;
  }

  const logoutButton = document.getElementById(ELEMENT_IDS.LOGOUT_BUTTON);
  if (logoutButton && !logoutButton.__wired) {
    logoutButton.addEventListener('click', (e) => {
      e.preventDefault();
      handleLogout();
    });
    logoutButton.__wired = true;
  }
}

function handleLogout() {
  clearStorage();
  showMessage('Logged out successfully.', MESSAGE_TYPES.SUCCESS);
  setTimeout(() => {
    window.location.href = '/index.html';
  }, 1000);
}

// ---- Edit Mode Functions ----
function enterEditMode() {
  const inputs = [
    document.getElementById(ELEMENT_IDS.DISPLAY_NAME),
    document.getElementById(ELEMENT_IDS.DISPLAY_EMAIL),
    document.getElementById(ELEMENT_IDS.DISPLAY_AGE),
    document.getElementById(ELEMENT_IDS.DISPLAY_PHONE),
    document.getElementById(ELEMENT_IDS.DISPLAY_ADDRESS)
  ];

  const cancelBtn = document.querySelector('.btn-cancel');
  const saveBtn = document.querySelector('.btn-save');

  // Store original values and make inputs editable
  inputs.forEach(input => {
    if (input) {
      input.dataset.original = input.value;
      input.removeAttribute('readonly');
      input.classList.add('editing');
    }
  });

  // Update button states
  if (saveBtn) {
    saveBtn.style.display = 'inline-block';
    const editBtn = document.querySelector('.btn-edit');
    if (editBtn) editBtn.style.display = 'none';
    // Add new event listener
    saveBtn.__saveHandler = (e) => {
      e.preventDefault();
      saveProfileChanges();
    };
    saveBtn.addEventListener('click', saveBtn.__saveHandler);
    saveBtn.__saveWired = true;
  }
  
  if (cancelBtn) {
    cancelBtn.style.display = 'inline-block';
  }
}

async function saveProfileChanges() {
  if (!isAuthenticated()) {
    showMessage('Please log in to update your profile.', MESSAGE_TYPES.ERROR);
    return;
  }

  // Get input values
  const nameInput = document.getElementById(ELEMENT_IDS.DISPLAY_NAME);
  const emailInput = document.getElementById(ELEMENT_IDS.DISPLAY_EMAIL);
  const ageInput = document.getElementById(ELEMENT_IDS.DISPLAY_AGE);
  const phoneInput = document.getElementById(ELEMENT_IDS.DISPLAY_PHONE);
  const addressInput = document.getElementById(ELEMENT_IDS.DISPLAY_ADDRESS);

  // Create update data with sanitized inputs
  const updateData = {
    full_name: nameInput ? sanitizeInput(nameInput.value) : '',
    email: emailInput ? sanitizeInput(emailInput.value) : '',
    age: ageInput ? parseInt(sanitizeInput(ageInput.value)) || null : null,
    phone: phoneInput ? sanitizeInput(phoneInput.value) : '',
    address: addressInput ? sanitizeInput(addressInput.value) : ''
  };

  // Validate user data
  const validationErrors = validateProfileData(updateData);
  if (validationErrors.length > 0) {
    showMessage('Please fix the following errors: ' + validationErrors.join(', '), MESSAGE_TYPES.ERROR);
    return;
  }

  try {
    // Show saving state
    showMessage('Saving your profile...', MESSAGE_TYPES.INFO);

    // Update profile via API
    const response = await updateUserProfile(updateData);
    
    if (response.status === 'success') {
      const updatedUser = response.data.user;
      
      // Update display elements with the server response
      updateElementText(ELEMENT_IDS.USER_NAME, updatedUser.full_name);
      updateElementText(ELEMENT_IDS.USER_EMAIL, updatedUser.email);
      updateElementText(ELEMENT_IDS.USER_AGE, updatedUser.age);
      updateElementText(ELEMENT_IDS.USER_PHONE, updatedUser.phone);
      updateElementText(ELEMENT_IDS.USER_ADDRESS, updatedUser.address);

      exitEditMode();
      showMessage('Profile updated successfully!', MESSAGE_TYPES.SUCCESS);
      
      console.log('Profile updated successfully:', updatedUser);
    } else {
      throw new Error('Failed to update profile');
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    showMessage('Failed to save profile. Please try again.', MESSAGE_TYPES.ERROR);
    
    // If it's an authentication error, redirect to login
    if (error.status === 401) {
      setTimeout(() => {
        window.location.href = '/pages/login.html';
      }, 2000);
    }
  }
}

function cancelEdit() {
  const inputIds = [
    ELEMENT_IDS.DISPLAY_NAME,
    ELEMENT_IDS.DISPLAY_EMAIL,
    ELEMENT_IDS.CURRENT_THEME,
    ELEMENT_IDS.DISPLAY_AGE,
    ELEMENT_IDS.DISPLAY_PHONE,
    ELEMENT_IDS.DISPLAY_ADDRESS
  ];

  inputIds.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.value = element.dataset.original;
    }
  });
  
  exitEditMode();
  showMessage('Changes cancelled.', MESSAGE_TYPES.INFO);
}

function exitEditMode() {
  const inputs = [
    document.getElementById(ELEMENT_IDS.DISPLAY_NAME),
    document.getElementById(ELEMENT_IDS.DISPLAY_EMAIL),
    document.getElementById(ELEMENT_IDS.CURRENT_THEME),
    document.getElementById(ELEMENT_IDS.DISPLAY_AGE),
    document.getElementById(ELEMENT_IDS.DISPLAY_PHONE),
    document.getElementById(ELEMENT_IDS.DISPLAY_ADDRESS)
  ];

  const editBtn = document.querySelector('.btn-edit');
  const cancelBtn = document.querySelector('.btn-cancel');

  // Reset input states
  inputs.forEach(input => {
    if (input) {
      input.setAttribute('readonly', 'true');
      input.classList.remove('editing');
      delete input.dataset.original;
    }
  });
  
  // Reset button states
  if (editBtn) {
    editBtn.style.display = 'inline-block';
    const saveBtn = document.querySelector('.btn-save');
    if (saveBtn) saveBtn.style.display = 'none';
  }
  
  if (cancelBtn) {
    cancelBtn.style.display = 'none';
  }
}

// ---- Delete Profile ----
async function deleteProfile() {
  const confirmMessage = 'Are you sure you want to delete your profile? This action cannot be undone and you will be logged out.';
  
  if (!confirm(confirmMessage)) {
    return;
  }

  // Confirm deletion
  const confirmed = confirm('Are you sure you want to delete your account? This action cannot be undone.');
  if (!confirmed) {
    return;
  }

  try {
    // Show deleting state
    showMessage('Deleting your account...', MESSAGE_TYPES.INFO);

    // Delete account via API (no password required)
    const response = await deleteUserAccount();
    
    if (response.status === 'success') {
      clearStorage();
      showMessage('Profile deleted successfully.', MESSAGE_TYPES.SUCCESS);
      
      setTimeout(() => {
        window.location.href = '/index.html';
      }, 1500);
      
      console.log('Account deleted successfully');
    } else {
      throw new Error('Failed to delete account');
    }
  } catch (error) {
    console.error('Error deleting profile:', error);
    
    // Handle different error types
    let errorMessage = 'Error deleting profile. Please try again.';
    
    if (error.status === 403) {
      errorMessage = 'You do not have permission to delete this account.';
    } else if (error.type === 'NETWORK_ERROR') {
      errorMessage = 'Network error. Please check your connection and try again.';
    }
    
    showMessage(errorMessage, MESSAGE_TYPES.ERROR);
  }
}

// ---- Message Display ----
function showMessage(message, type = MESSAGE_TYPES.INFO) {
  // Remove any existing messages
  const existingMessages = document.querySelectorAll('.profile-message');
  existingMessages.forEach(msg => msg.remove());

  const messageEl = document.createElement('div');
  messageEl.className = `profile-message ${type}`;
  messageEl.textContent = message;
  
  // Styling
  const backgroundColor = {
    [MESSAGE_TYPES.SUCCESS]: '#4CAF50',
    [MESSAGE_TYPES.ERROR]: '#f44336',
    [MESSAGE_TYPES.INFO]: '#2196F3'
  };

  Object.assign(messageEl.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '12px 20px',
    borderRadius: '5px',
    color: '#fff',
    zIndex: '1000',
    fontWeight: '500',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    backgroundColor: backgroundColor[type] || backgroundColor[MESSAGE_TYPES.INFO],
    maxWidth: '300px',
    wordWrap: 'break-word'
  });

  document.body.appendChild(messageEl);
  
  // Auto-remove after 4 seconds
  setTimeout(() => {
    if (messageEl.parentNode) {
      messageEl.remove();
    }
  }, 4000);
}

function clearMessage() {
  const existingMessages = document.querySelectorAll('.profile-message');
  existingMessages.forEach(msg => msg.remove());
}

// Export functions for potential external use (if needed)
window.profileUtils = {
  cancelEdit,
  deleteProfile,
  showMessage,
  clearMessage,
  loadUserProfile
};