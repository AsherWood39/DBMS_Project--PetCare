// API utility functions for PetCare client-server communication

// API Configuration
const API_CONFIG = {
  BASE_URL: 'http://localhost:5000/api',
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000 // 1 second
};

// Storage keys
const STORAGE_KEYS = {
  TOKEN: 'petcare_token',
  USER: 'currentUser',
  AUTH_STATE: 'simpleAuthState'
};

// Error types
const ERROR_TYPES = {
  NETWORK: 'NETWORK_ERROR',
  AUTH: 'AUTH_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  SERVER: 'SERVER_ERROR',
  TIMEOUT: 'TIMEOUT_ERROR'
};

/**
 * Custom API Error class
 */
class ApiError extends Error {
  constructor(message, status, type = ERROR_TYPES.SERVER, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.type = type;
    this.data = data;
  }
}

/**
 * Get authentication token from storage
 */
function getAuthToken() {
  return localStorage.getItem(STORAGE_KEYS.TOKEN) || 
         sessionStorage.getItem(STORAGE_KEYS.TOKEN);
}

/**
 * Set authentication token in storage
 */
function setAuthToken(token, persistent = true) {
  if (persistent) {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.AUTH_STATE, 'logged-in');
  } else {
    sessionStorage.setItem(STORAGE_KEYS.TOKEN, token);
    sessionStorage.setItem(STORAGE_KEYS.AUTH_STATE, 'logged-in');
  }
}

/**
 * Remove authentication token from storage
 */
function removeAuthToken() {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.AUTH_STATE);
  sessionStorage.removeItem(STORAGE_KEYS.AUTH_STATE);
  localStorage.removeItem(STORAGE_KEYS.USER);
  sessionStorage.removeItem(STORAGE_KEYS.USER);
}

/**
 * Store user data in local storage
 */
function storeUserData(userData, persistent = true) {
  const userString = JSON.stringify(userData);
  if (persistent) {
    localStorage.setItem(STORAGE_KEYS.USER, userString);
  } else {
    sessionStorage.setItem(STORAGE_KEYS.USER, userString);
  }
}

/**
 * Get user data from storage
 */
function getUserData() {
  try {
    const userData = localStorage.getItem(STORAGE_KEYS.USER) || 
                    sessionStorage.getItem(STORAGE_KEYS.USER);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
}

/**
 * Check if user is authenticated
 */
function isAuthenticated() {
  const token = getAuthToken();
  const authState = localStorage.getItem(STORAGE_KEYS.AUTH_STATE) === 'logged-in' ||
                   sessionStorage.getItem(STORAGE_KEYS.AUTH_STATE) === 'logged-in';
  return !!(token && authState);
}

/**
 * Sleep function for retry delays
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Main API request function with retry logic
 */
async function apiRequest(endpoint, options = {}) {
  const {
    method = 'GET',
    body = null,
    headers = {},
    timeout = API_CONFIG.TIMEOUT,
    requireAuth = false,
    retryAttempts = API_CONFIG.RETRY_ATTEMPTS
  } = options;

  // Prepare headers
  const requestHeaders = {
    'Content-Type': 'application/json',
    ...headers
  };

  // Add authentication header if required or token is available
  const token = getAuthToken();
  if (requireAuth || token) {
    if (!token && requireAuth) {
      throw new ApiError('Authentication required', 401, ERROR_TYPES.AUTH);
    }
    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }
  }

  // Prepare request configuration
  const requestConfig = {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : null
  };

  const url = `${API_CONFIG.BASE_URL}${endpoint}`;

  // Retry logic
  for (let attempt = 1; attempt <= retryAttempts; attempt++) {
    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...requestConfig,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // Handle different response statuses
      if (response.ok) {
        const data = await response.json();
        return data;
      }

      // Handle error responses
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: 'Unknown server error' };
      }

      // Handle authentication errors
      if (response.status === 401) {
        removeAuthToken();
        throw new ApiError(
          errorData.message || 'Authentication failed',
          401,
          ERROR_TYPES.AUTH,
          errorData
        );
      }

      // Handle validation errors
      if (response.status === 400) {
        throw new ApiError(
          errorData.message || 'Validation failed',
          400,
          ERROR_TYPES.VALIDATION,
          errorData
        );
      }

      // Handle other HTTP errors
      throw new ApiError(
        errorData.message || `HTTP ${response.status}`,
        response.status,
        ERROR_TYPES.SERVER,
        errorData
      );

    } catch (error) {
      // Handle network/timeout errors
      if (error.name === 'AbortError') {
        if (attempt === retryAttempts) {
          throw new ApiError('Request timeout', 408, ERROR_TYPES.TIMEOUT);
        }
      } else if (error instanceof ApiError) {
        throw error;
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        if (attempt === retryAttempts) {
          throw new ApiError('Network error', 0, ERROR_TYPES.NETWORK);
        }
      } else {
        throw error;
      }

      // Wait before retry
      if (attempt < retryAttempts) {
        await sleep(API_CONFIG.RETRY_DELAY * attempt);
      }
    }
  }
}

// =================================
// AUTHENTICATION API FUNCTIONS
// =================================

/**
 * Register a new user
 */
export async function registerUser(userData) {
  try {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: userData
    });

    if (response.status === 'success' && response.token) {
      setAuthToken(response.token, true);
      storeUserData(response.data.user, true);
    }

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

/**
 * Login user
 */
export async function loginUser(credentials, rememberMe = true) {
  try {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: credentials
    });

    if (response.status === 'success' && response.token) {
      setAuthToken(response.token, rememberMe);
      storeUserData(response.data.user, rememberMe);
    }

    return response;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

/**
 * Logout user
 */
export async function logoutUser() {
  try {
    await apiRequest('/auth/logout', {
      method: 'POST',
      requireAuth: true
    });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    removeAuthToken();
  }
}

/**
 * Get current user profile
 */
export async function getCurrentUser() {
  try {
    const response = await apiRequest('/auth/me', {
      requireAuth: true
    });

    if (response.status === 'success' && response.data.user) {
      storeUserData(response.data.user);
    }

    return response;
  } catch (error) {
    console.error('Get current user error:', error);
    throw error;
  }
}

/**
 * Update user password
 */
export async function updatePassword(passwordData) {
  try {
    const response = await apiRequest('/auth/update-password', {
      method: 'PUT',
      body: passwordData,
      requireAuth: true
    });

    return response;
  } catch (error) {
    console.error('Update password error:', error);
    throw error;
  }
}

/**
 * Check if email exists
 */
export async function checkEmailExists(email) {
  try {
    const response = await apiRequest('/auth/check-email', {
      method: 'POST',
      body: { email }
    });

    return response;
  } catch (error) {
    console.error('Check email error:', error);
    throw error;
  }
}

/**
 * Get user dashboard statistics
 */
export async function getUserStats() {
  try {
    const response = await apiRequest('/auth/stats', {
      requireAuth: true
    });

    return response;
  } catch (error) {
    console.error('Get user stats error:', error);
    throw error;
  }
}

// =================================
// USER MANAGEMENT API FUNCTIONS
// =================================

/**
 * Get user profile
 */
export async function getUserProfile() {
  try {
    const response = await apiRequest('/users/profile', {
      requireAuth: true
    });

    if (response.status === 'success' && response.data.user) {
      storeUserData(response.data.user);
    }

    return response;
  } catch (error) {
    console.error('Get user profile error:', error);
    throw error;
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(profileData) {
  try {
    const response = await apiRequest('/users/profile', {
      method: 'PUT',
      body: profileData,
      requireAuth: true
    });

    if (response.status === 'success' && response.data.user) {
      storeUserData(response.data.user);
    }

    return response;
  } catch (error) {
    console.error('Update user profile error:', error);
    throw error;
  }
}

/**
 * Delete user account
 */
export async function deleteUserAccount() {
  try {
    const response = await apiRequest('/users/profile', {
      method: 'DELETE',
      requireAuth: true
    });

    if (response.status === 'success') {
      removeAuthToken();
    }

    return response;
  } catch (error) {
    console.error('Delete user account error:', error);
    throw error;
  }
}

/**
 * Get user's pets (for owners)
 */
export async function getUserPets(queryParams = {}) {
  try {
    const searchParams = new URLSearchParams(queryParams);
    const endpoint = `/users/pets${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
    
    const response = await apiRequest(endpoint, {
      requireAuth: true
    });

    return response;
  } catch (error) {
    console.error('Get user pets error:', error);
    throw error;
  }
}

/**
 * Get user's adoption requests (for adopters)
 */
export async function getUserAdoptionRequests(queryParams = {}) {
  try {
    const searchParams = new URLSearchParams(queryParams);
    const endpoint = `/users/adoption-requests${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
    
    const response = await apiRequest(endpoint, {
      requireAuth: true
    });

    return response;
  } catch (error) {
    console.error('Get user adoption requests error:', error);
    throw error;
  }
}

/**
 * Verify user email
 */
export async function verifyUserEmail() {
  try {
    const response = await apiRequest('/users/verify-email', {
      method: 'PATCH',
      requireAuth: true
    });

    return response;
  } catch (error) {
    console.error('Verify email error:', error);
    throw error;
  }
}

/**
 * Change user role
 */
export async function changeUserRole(newRole) {
  try {
    const response = await apiRequest('/users/change-role', {
      method: 'PATCH',
      body: { newRole },
      requireAuth: true
    });

    if (response.status === 'success') {
      // Update stored user data with new role
      const userData = getUserData();
      if (userData) {
        userData.role = newRole;
        storeUserData(userData);
      }
    }

    return response;
  } catch (error) {
    console.error('Change user role error:', error);
    throw error;
  }
}

/**
 * Get detailed user statistics
 */
export async function getUserDetailedStats() {
  try {
    const response = await apiRequest('/users/stats', {
      requireAuth: true
    });

    return response;
  } catch (error) {
    console.error('Get detailed user stats error:', error);
    throw error;
  }
}

// =================================
// UTILITY FUNCTIONS
// =================================

/**
 * Check API health
 */
export async function checkApiHealth() {
  try {
    const response = await apiRequest('/health');
    return response;
  } catch (error) {
    console.error('API health check error:', error);
    throw error;
  }
}

/**
 * Test authentication token validity
 */
export async function validateToken() {
  try {
    const response = await getCurrentUser();
    return response.status === 'success';
  } catch (error) {
    if (error.status === 401) {
      removeAuthToken();
      return false;
    }
    throw error;
  }
}

/**
 * Refresh user data from server
 */
export async function refreshUserData() {
  try {
    if (isAuthenticated()) {
      const response = await getCurrentUser();
      return response.data.user;
    }
    return null;
  } catch (error) {
    console.error('Refresh user data error:', error);
    return null;
  }
}

/**
 * Initialize API client
 */
export function initializeApi() {
  // Check if token is still valid on page load
  if (isAuthenticated()) {
    validateToken().catch(error => {
      console.error('Token validation failed on init:', error);
    });
  }
}

// =================================
// EXPORT UTILITY FUNCTIONS
// =================================

export {
  // Configuration
  API_CONFIG,
  ERROR_TYPES,
  STORAGE_KEYS,
  
  // Error class
  ApiError,
  
  // Authentication utilities
  isAuthenticated,
  getAuthToken,
  getUserData,
  removeAuthToken,
  
  // Generic API function
  apiRequest
};

// Auto-initialize on module load
initializeApi();
