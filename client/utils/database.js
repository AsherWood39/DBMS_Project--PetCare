/**
 * Database Connection Utility for PetCare
 * This file provides database connection and query utilities
 * Note: This is a frontend utility - actual database operations should be handled by a backend API
 */

// Database configuration
const DB_CONFIG = {
    host: 'localhost',
    port: 3306,
    database: 'petcare_db',
    user: 'petcare_user',
    password: 'your_secure_password', // Replace with actual password
    charset: 'utf8mb4'
};

// API endpoints (replace with your actual backend API URLs)
const API_ENDPOINTS = {
    base: 'http://localhost:3000/api', // Replace with your backend URL
    auth: {
        login: '/auth/login',
        register: '/auth/register',
        logout: '/auth/logout',
        profile: '/auth/profile'
    },
    pets: {
        list: '/pets',
        create: '/pets',
        get: '/pets/:id',
        update: '/pets/:id',
        delete: '/pets/:id',
        search: '/pets/search'
    },
    adoptions: {
        requests: '/adoptions/requests',
        create: '/adoptions/requests',
        update: '/adoptions/requests/:id',
        approve: '/adoptions/requests/:id/approve',
        reject: '/adoptions/requests/:id/reject'
    },
    users: {
        profile: '/users/profile',
        update: '/users/profile',
        favorites: '/users/favorites'
    }
};

/**
 * API Utility Class
 * Handles all API calls to the backend
 */
class DatabaseAPI {
    constructor() {
        this.baseURL = API_ENDPOINTS.base;
        this.token = localStorage.getItem('auth_token');
    }

    /**
     * Set authentication token
     */
    setToken(token) {
        this.token = token;
        localStorage.setItem('auth_token', token);
    }

    /**
     * Clear authentication token
     */
    clearToken() {
        this.token = null;
        localStorage.removeItem('auth_token');
    }

    /**
     * Get headers for API requests
     */
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        
        return headers;
    }

    /**
     * Make API request
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            method: 'GET',
            headers: this.getHeaders(),
            ...options
        };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // =====================================================
    // AUTHENTICATION METHODS
    // =====================================================

    /**
     * User login
     */
    async login(email, password) {
        const data = await this.request(API_ENDPOINTS.auth.login, {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        if (data.token) {
            this.setToken(data.token);
        }
        
        return data;
    }

    /**
     * User registration
     */
    async register(userData) {
        return await this.request(API_ENDPOINTS.auth.register, {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    /**
     * User logout
     */
    async logout() {
        try {
            await this.request(API_ENDPOINTS.auth.logout, {
                method: 'POST'
            });
        } finally {
            this.clearToken();
        }
    }

    /**
     * Get user profile
     */
    async getProfile() {
        return await this.request(API_ENDPOINTS.auth.profile);
    }

    // =====================================================
    // PETS METHODS
    // =====================================================

    /**
     * Get all available pets
     */
    async getPets(filters = {}) {
        const queryParams = new URLSearchParams(filters);
        const endpoint = `${API_ENDPOINTS.pets.list}?${queryParams}`;
        return await this.request(endpoint);
    }

    /**
     * Get pet by ID
     */
    async getPet(petId) {
        const endpoint = API_ENDPOINTS.pets.get.replace(':id', petId);
        return await this.request(endpoint);
    }

    /**
     * Create new pet listing
     */
    async createPet(petData) {
        return await this.request(API_ENDPOINTS.pets.create, {
            method: 'POST',
            body: JSON.stringify(petData)
        });
    }

    /**
     * Update pet listing
     */
    async updatePet(petId, petData) {
        const endpoint = API_ENDPOINTS.pets.update.replace(':id', petId);
        return await this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(petData)
        });
    }

    /**
     * Delete pet listing
     */
    async deletePet(petId) {
        const endpoint = API_ENDPOINTS.pets.delete.replace(':id', petId);
        return await this.request(endpoint, {
            method: 'DELETE'
        });
    }

    /**
     * Search pets
     */
    async searchPets(searchParams) {
        const queryParams = new URLSearchParams(searchParams);
        const endpoint = `${API_ENDPOINTS.pets.search}?${queryParams}`;
        return await this.request(endpoint);
    }

    // =====================================================
    // ADOPTION METHODS
    // =====================================================

    /**
     * Get adoption requests
     */
    async getAdoptionRequests(filters = {}) {
        const queryParams = new URLSearchParams(filters);
        const endpoint = `${API_ENDPOINTS.adoptions.requests}?${queryParams}`;
        return await this.request(endpoint);
    }

    /**
     * Create adoption request
     */
    async createAdoptionRequest(requestData) {
        return await this.request(API_ENDPOINTS.adoptions.create, {
            method: 'POST',
            body: JSON.stringify(requestData)
        });
    }

    /**
     * Update adoption request
     */
    async updateAdoptionRequest(requestId, requestData) {
        const endpoint = API_ENDPOINTS.adoptions.update.replace(':id', requestId);
        return await this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(requestData)
        });
    }

    /**
     * Approve adoption request
     */
    async approveAdoptionRequest(requestId, approvalData) {
        const endpoint = API_ENDPOINTS.adoptions.approve.replace(':id', requestId);
        return await this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(approvalData)
        });
    }

    /**
     * Reject adoption request
     */
    async rejectAdoptionRequest(requestId, rejectionData) {
        const endpoint = API_ENDPOINTS.adoptions.reject.replace(':id', requestId);
        return await this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(rejectionData)
        });
    }

    // =====================================================
    // USER METHODS
    // =====================================================

    /**
     * Update user profile
     */
    async updateProfile(profileData) {
        return await this.request(API_ENDPOINTS.users.update, {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
    }

    /**
     * Get user favorites
     */
    async getFavorites() {
        return await this.request(API_ENDPOINTS.users.favorites);
    }

    /**
     * Add pet to favorites
     */
    async addToFavorites(petId) {
        return await this.request(API_ENDPOINTS.users.favorites, {
            method: 'POST',
            body: JSON.stringify({ pet_id: petId })
        });
    }

    /**
     * Remove pet from favorites
     */
    async removeFromFavorites(petId) {
        return await this.request(`${API_ENDPOINTS.users.favorites}/${petId}`, {
            method: 'DELETE'
        });
    }
}

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

/**
 * Format pet data for display
 */
function formatPetData(pet) {
    return {
        id: pet.pet_id,
        name: pet.pet_name,
        category: pet.category,
        breed: pet.breed,
        age: pet.age,
        gender: pet.gender,
        color: pet.color,
        weight: pet.weight,
        temperament: pet.temperament,
        location: pet.location,
        image: pet.pet_image,
        diet: pet.diet_preferences,
        notes: pet.special_notes,
        owner: {
            name: pet.owner_name,
            phone: pet.owner_phone,
            email: pet.owner_email
        },
        created_at: pet.created_at
    };
}

/**
 * Format adoption request data
 */
function formatAdoptionRequestData(request) {
    return {
        id: request.request_id,
        pet_id: request.pet_id,
        pet_name: request.pet_name,
        adopter_id: request.adopter_id,
        adopter_name: request.adopter_name,
        status: request.status,
        created_at: request.created_at,
        updated_at: request.updated_at
    };
}

/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate phone number format
 */
function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Sanitize input data
 */
function sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    return input.trim().replace(/[<>]/g, '');
}

/**
 * Generate unique ID
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// =====================================================
// ERROR HANDLING
// =====================================================

/**
 * Handle API errors
 */
function handleAPIError(error) {
    console.error('API Error:', error);
    
    if (error.message.includes('401')) {
        // Unauthorized - redirect to login
        window.location.href = '/pages/login.html';
        return;
    }
    
    if (error.message.includes('403')) {
        // Forbidden
        alert('You do not have permission to perform this action.');
        return;
    }
    
    if (error.message.includes('404')) {
        // Not found
        alert('The requested resource was not found.');
        return;
    }
    
    if (error.message.includes('500')) {
        // Server error
        alert('A server error occurred. Please try again later.');
        return;
    }
    
    // Generic error
    alert('An error occurred. Please try again.');
}

// =====================================================
// EXPORT
// =====================================================

// Create global instance
const dbAPI = new DatabaseAPI();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DatabaseAPI, dbAPI, formatPetData, formatAdoptionRequestData, isValidEmail, isValidPhone, sanitizeInput, generateId, handleAPIError };
} else {
    // Make available globally
    window.DatabaseAPI = DatabaseAPI;
    window.dbAPI = dbAPI;
    window.formatPetData = formatPetData;
    window.formatAdoptionRequestData = formatAdoptionRequestData;
    window.isValidEmail = isValidEmail;
    window.isValidPhone = isValidPhone;
    window.sanitizeInput = sanitizeInput;
    window.generateId = generateId;
    window.handleAPIError = handleAPIError;
}
