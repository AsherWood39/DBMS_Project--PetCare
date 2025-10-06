// Shared Authentication State Management
// This handles authentication state across all pages

import { 
  isAuthenticated, 
  getUserData, 
  logoutUser,
  validateToken,
  refreshUserData 
} from './api.js';

// Check if user is logged in (updated to use API client)
function isUserLoggedIn() {
  return isAuthenticated();
}

// Get current user info (updated to use API client)
function getCurrentUser() {
  return getUserData();
}

// Validate user session with server
async function validateUserSession() {
  try {
    if (isAuthenticated()) {
      const isValid = await validateToken();
      if (!isValid) {
        console.log('Session expired, logging out user');
        await logout();
        return false;
      }
      return true;
    }
    return false;
  } catch (error) {
    console.error('Session validation error:', error);
    return false;
  }
}

// Refresh user data from server
async function refreshCurrentUser() {
  try {
    const userData = await refreshUserData();
    if (userData) {
      updateGlobalAuthUI(true);
      return userData;
    }
    return null;
  } catch (error) {
    console.error('Error refreshing user data:', error);
    return null;
  }
}

// Update authentication UI across all pages
function updateGlobalAuthUI(isLoggedIn) {
  const elements = {
    loggedOutButtons: document.querySelector('.logged-out-buttons'),
    loggedInButtons: document.querySelector('.logged-in-buttons'),
    roleSelection: document.querySelector('.role-selection'),
    homeLink: document.getElementById('home-link'),
  };

  const displayConfig = isLoggedIn
    ? {
        loggedOutButtons: 'none',
        loggedInButtons: 'flex',
        roleSelection: 'none',
        homeLink: 'block',
      }
    : {
        loggedOutButtons: 'flex',
        loggedInButtons: 'none',
        roleSelection: 'flex',
        homeLink: 'none',
      };

  for (const key in displayConfig) {
    if (elements[key]) {
      elements[key].style.display = displayConfig[key];
    }
  }
}

// Logout function (updated to use API client)
async function logout() {
  try {
    // Call server logout endpoint
    await logoutUser();
    console.log('User logged out successfully');
  } catch (error) {
    console.error('Logout error:', error);
    // Even if server logout fails, clear local state
  }
  
  // Update UI
  updateGlobalAuthUI(false);
  
  // Show logout message
  showMessage('Logged out successfully', 'success');
  
  // Redirect to home page if not already there
  setTimeout(() => {
    if (window.location.pathname !== '/index.html' && !window.location.pathname.endsWith('/')) {
      window.location.href = '/index.html';
    } else {
      window.location.reload();
    }
  }, 1000);
}

// Show message utility function
function showMessage(message, type = 'info') {
  // Remove any existing messages
  const existingMessages = document.querySelectorAll('.auth-message');
  existingMessages.forEach(msg => msg.remove());

  const messageEl = document.createElement('div');
  messageEl.className = `auth-message ${type}`;
  messageEl.textContent = message;
  
  // Styling
  const backgroundColor = {
    success: '#4CAF50',
    error: '#f44336',
    info: '#2196F3',
    warning: '#ff9800'
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
    backgroundColor: backgroundColor[type] || backgroundColor.info,
    maxWidth: '300px',
    wordWrap: 'break-word'
  });

  document.body.appendChild(messageEl);
  
  // Auto-remove after 3 seconds
  setTimeout(() => {
    if (messageEl.parentNode) {
      messageEl.remove();
    }
  }, 3000);
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
      window.location.href = '/pages/signup.html';
    });
  }

  if (ownerButton) {
    ownerButton.addEventListener('click', (e) => {
      e.preventDefault();
      setSignupRole('Owner');
      window.location.href = '/pages/signup.html';
    });
  }

  if (headerSignupButton) {
    headerSignupButton.addEventListener('click', (e) => {
      e.preventDefault();
      // Clear any pre-selected role when using header signup
      setSignupRole(null);
      const href = headerSignupButton.querySelector('a')?.href || '/pages/signup.html';
      window.location.href = href;
    });
  }
}

// Initialize authentication on any page (updated to use API client)
async function initializeAuth() {
  console.log('Initializing global authentication with API integration');
  
  try {
    // Validate session with server
    const isLoggedIn = await validateUserSession();
    updateGlobalAuthUI(isLoggedIn);
    
    // If user is logged in, refresh their data
    if (isLoggedIn) {
      await refreshCurrentUser();
    }
  } catch (error) {
    console.error('Auth initialization error:', error);
    updateGlobalAuthUI(false);
  }
  
  // Initialize role selection handlers
  handleRoleSelection();
  
  // Add logout functionality to any logout button
  const logoutButtons = document.querySelectorAll('#logout-button, .logout-btn');
  logoutButtons.forEach(button => {
    if (!button.dataset.listenerAdded) {
      button.addEventListener('click', async (e) => {
        e.preventDefault();
        button.disabled = true;
        button.textContent = 'Logging out...';
        try {
          await logout();
        } catch (error) {
          console.error('Logout error:', error);
          showMessage('Logout failed. Please try again.', 'error');
        } finally {
          button.disabled = false;
          button.textContent = 'Logout';
        }
      });
      button.dataset.listenerAdded = 'true';
    }
  });
  
  // Listen for storage changes to sync auth state across tabs
  window.addEventListener('storage', async (e) => {
    if (e.key === 'petcare_token' || e.key === 'currentUser' || e.key === 'simpleAuthState') {
      const newLoginState = await validateUserSession();
      updateGlobalAuthUI(newLoginState);
    }
  });
}

// Export functions for use in other modules
window.authUtils = {
  isUserLoggedIn,
  getCurrentUser,
  logout,
  validateUserSession,
  refreshCurrentUser,
  showMessage,
  updateGlobalAuthUI
};

// Auto-initialize when script loads
document.addEventListener('DOMContentLoaded', initializeAuth);
