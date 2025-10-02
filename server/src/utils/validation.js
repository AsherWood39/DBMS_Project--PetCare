// Validation utilities for PetCare API

import { AppError } from '../middleware/errorHandler.js';

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone validation regex (supports various formats)
const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;

// Password validation (minimum 6 characters)
const passwordRegex = /^.{6,}$/;

// Validation functions
export const validators = {
  // Email validation
  email: (email) => {
    if (!email) {
      throw new AppError('Email is required', 400);
    }
    if (typeof email !== 'string') {
      throw new AppError('Email must be a string', 400);
    }
    if (!emailRegex.test(email.trim())) {
      throw new AppError('Please provide a valid email address', 400);
    }
    return email.trim().toLowerCase();
  },

  // Password validation
  password: (password) => {
    if (!password) {
      throw new AppError('Password is required', 400);
    }
    if (password.length < 6) {
      throw new AppError('Password must be at least 6 characters long', 400);
    }
    return password;
  },

  // Name validation
  name: (name, fieldName = 'Name') => {
    if (!name) {
      throw new AppError(`${fieldName} is required`, 400);
    }
    if (typeof name !== 'string') {
      throw new AppError(`${fieldName} must be a string`, 400);
    }
    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      throw new AppError(`${fieldName} must be at least 2 characters long`, 400);
    }
    if (trimmedName.length > 100) {
      throw new AppError(`${fieldName} must not exceed 100 characters`, 400);
    }
    if (!/^[a-zA-Z\s'-]+$/.test(trimmedName)) {
      throw new AppError(`${fieldName} can only contain letters, spaces, hyphens, and apostrophes`, 400);
    }
    return trimmedName;
  },

  // Age validation (optional)
  age: (age, required = false) => {
    if (age === undefined || age === null || age === '') {
      if (required) {
        throw new AppError('Age is required', 400);
      }
      return null;
    }
    const numAge = Number(age);
    if (isNaN(numAge)) {
      throw new AppError('Age must be a valid number', 400);
    }
    if (numAge < 18) {
      throw new AppError('Age must be at least 18 years', 400);
    }
    if (numAge > 120) {
      throw new AppError('Age must be less than 120 years', 400);
    }
    return numAge;
  },

  // Phone validation
  phone: (phone, required = false) => {
    if (!phone) {
      if (required) {
        throw new AppError('Phone number is required', 400);
      }
      return null;
    }
    if (typeof phone !== 'string') {
      throw new AppError('Phone number must be a string', 400);
    }
    const cleanPhone = phone.trim().replace(/[\s\-\(\)]/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      throw new AppError('Please provide a valid phone number', 400);
    }
    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      throw new AppError('Phone number must be between 10 and 15 digits', 400);
    }
    return cleanPhone;
  },

  // Role validation
  role: (role) => {
    const validRoles = ['Adopter', 'Owner'];
    if (!role) {
      return 'Adopter'; // Default role
    }
    if (!validRoles.includes(role)) {
      throw new AppError(`Role must be one of: ${validRoles.join(', ')}`, 400);
    }
    return role;
  },

  // Address validation
  address: (address, required = false) => {
    if (!address) {
      if (required) {
        throw new AppError('Address is required', 400);
      }
      return null;
    }
    if (typeof address !== 'string') {
      throw new AppError('Address must be a string', 400);
    }
    const trimmedAddress = address.trim();
    if (trimmedAddress.length < 10) {
      throw new AppError('Address must be at least 10 characters long', 400);
    }
    if (trimmedAddress.length > 500) {
      throw new AppError('Address must not exceed 500 characters', 400);
    }
    return trimmedAddress;
  },

  // User ID validation
  userId: (userId) => {
    if (!userId) {
      throw new AppError('User ID is required', 400);
    }
    const numId = Number(userId);
    if (isNaN(numId) || numId <= 0) {
      throw new AppError('Invalid user ID', 400);
    }
    return numId;
  },

  // Generic string validation
  string: (value, fieldName, options = {}) => {
    const {
      required = false,
      minLength = 0,
      maxLength = 255,
      trim = true
    } = options;

    if (!value) {
      if (required) {
        throw new AppError(`${fieldName} is required`, 400);
      }
      return null;
    }

    if (typeof value !== 'string') {
      throw new AppError(`${fieldName} must be a string`, 400);
    }

    const processedValue = trim ? value.trim() : value;

    if (processedValue.length < minLength) {
      throw new AppError(`${fieldName} must be at least ${minLength} characters long`, 400);
    }

    if (processedValue.length > maxLength) {
      throw new AppError(`${fieldName} must not exceed ${maxLength} characters`, 400);
    }

    return processedValue;
  }
};

// Validation middleware
export const validateUserRegistration = (req, res, next) => {
  try {
    const { full_name, age, email, pass, role, phone, address } = req.body;

    req.validatedData = {
      full_name: validators.name(full_name, 'Full name'),
      age: validators.age(age, false), // Age is optional during registration
      email: validators.email(email),
      pass: validators.password(pass),
      role: validators.role(role),
      phone: validators.phone(phone, false),
      address: validators.address(address, false)
    };

    next();
  } catch (error) {
    next(error);
  }
};

export const validateUserLogin = (req, res, next) => {
  try {
    const { email, pass } = req.body;

    req.validatedData = {
      email: validators.email(email),
      pass: validators.password(pass)
    };

    next();
  } catch (error) {
    next(error);
  }
};

export const validateUserUpdate = (req, res, next) => {
  try {
    const { full_name, age, phone, address } = req.body;
    const validatedData = {};

    // Only validate provided fields
    if (full_name !== undefined) {
      validatedData.full_name = validators.name(full_name, 'Full name');
    }
    if (age !== undefined) {
      validatedData.age = validators.age(age, false); // Age is optional in updates
    }
    if (phone !== undefined) {
      validatedData.phone = validators.phone(phone, false);
    }
    if (address !== undefined) {
      validatedData.address = validators.address(address, false);
    }

    // Ensure at least one field is provided
    if (Object.keys(validatedData).length === 0) {
      throw new AppError('At least one field must be provided for update', 400);
    }

    req.validatedData = validatedData;
    next();
  } catch (error) {
    next(error);
  }
};

// Sanitization functions
export const sanitizers = {
  // Remove HTML tags and dangerous characters
  html: (str) => {
    if (typeof str !== 'string') return str;
    return str.replace(/<[^>]*>/g, '').replace(/[<>]/g, '');
  },

  // Sanitize SQL input (basic protection)
  sql: (str) => {
    if (typeof str !== 'string') return str;
    return str.replace(/['";\\]/g, '');
  },

  // Normalize whitespace
  whitespace: (str) => {
    if (typeof str !== 'string') return str;
    return str.replace(/\s+/g, ' ').trim();
  }
};

export default validators;
