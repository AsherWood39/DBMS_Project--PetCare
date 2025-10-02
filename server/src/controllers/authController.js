// Authentication controller for PetCare API

import bcrypt from 'bcrypt';
import { db } from '../server.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';
import { sendTokenResponse } from '../middleware/auth.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res, next) => {
  const { full_name, age, email, pass, role, phone, address } = req.validatedData;

  // Check if user already exists
  const [existingUsers] = await db.execute(
    'SELECT user_id FROM users WHERE email = ?',
    [email]
  );

  if (existingUsers.length > 0) {
    throw new AppError('User with this email already exists', 400);
  }

  // Hash password
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(pass, saltRounds);

  // Insert user into database
  const [result] = await db.execute(
    `INSERT INTO users (full_name, age, email, pass, role, phone, address, is_active, email_verified) 
     VALUES (?, ?, ?, ?, ?, ?, ?, true, false)`,
    [full_name, age || null, email, hashedPassword, role, phone, address]
  );

  // Get the created user
  const [users] = await db.execute(
    'SELECT user_id, full_name, email, role, phone, address, is_active, email_verified, created_at FROM users WHERE user_id = ?',
    [result.insertId]
  );

  const user = users[0];

  // Send token response
  sendTokenResponse(user, 201, res, 'User registered successfully');
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res, next) => {
  const { email, pass } = req.validatedData;

  // Get user from database
  const [users] = await db.execute(
    'SELECT user_id, full_name, email, pass, role, phone, address, is_active, email_verified, created_at FROM users WHERE email = ?',
    [email]
  );

  if (users.length === 0) {
    throw new AppError('Invalid email or password', 401);
  }

  const user = users[0];

  // Check if account is active
  if (!user.is_active) {
    throw new AppError('Account has been deactivated. Please contact support.', 401);
  }

  // Check password (handle both hashed and plain text for backward compatibility)
  let isPasswordValid = false;
  
  // Check if password is already bcrypt hashed (starts with $2b$ or $2a$)
  if (user.pass.startsWith('$2b$') || user.pass.startsWith('$2a$')) {
    isPasswordValid = await bcrypt.compare(pass, user.pass);
  } else {
    // Handle plain text password (for sample data)
    isPasswordValid = (pass === user.pass);
  }
  
  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }

  // Update last login timestamp (optional)
  await db.execute(
    'UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
    [user.user_id]
  );

  // Remove password from user object
  delete user.pass;

  // Send token response
  sendTokenResponse(user, 200, res, 'Login successful');
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res, next) => {
  // Get user details from database (req.user is set by authenticate middleware)
  const [users] = await db.execute(
    'SELECT user_id, full_name, age, email, role, phone, address, is_active, email_verified, created_at, updated_at FROM users WHERE user_id = ?',
    [req.user.userId]
  );

  if (users.length === 0) {
    throw new AppError('User not found', 404);
  }

  const user = users[0];

  res.status(200).json({
    status: 'success',
    data: {
      user: {
        id: user.user_id,
        fullName: user.full_name,
        age: user.age,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        isActive: user.is_active,
        emailVerified: user.email_verified,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      }
    }
  });
});

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
export const updatePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  // Validate input
  if (!currentPassword || !newPassword) {
    throw new AppError('Please provide both current and new password', 400);
  }

  if (newPassword.length < 6) {
    throw new AppError('New password must be at least 6 characters long', 400);
  }

  // Get user with password
  const [users] = await db.execute(
    'SELECT user_id, pass FROM users WHERE user_id = ?',
    [req.user.userId]
  );

  if (users.length === 0) {
    throw new AppError('User not found', 404);
  }

  const user = users[0];

  // Check current password
  const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.pass);
  
  if (!isCurrentPasswordValid) {
    throw new AppError('Current password is incorrect', 400);
  }

  // Hash new password
  const saltRounds = 12;
  const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

  // Update password in database
  await db.execute(
    'UPDATE users SET pass = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
    [hashedNewPassword, req.user.userId]
  );

  res.status(200).json({
    status: 'success',
    message: 'Password updated successfully'
  });
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = asyncHandler(async (req, res, next) => {
  // Clear the cookie
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000), // 10 seconds
    httpOnly: true
  });

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully'
  });
});

// @desc    Check if email exists
// @route   POST /api/auth/check-email
// @access  Public
export const checkEmail = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError('Email is required', 400);
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new AppError('Please provide a valid email address', 400);
  }

  // Check if email exists
  const [users] = await db.execute(
    'SELECT user_id FROM users WHERE email = ?',
    [email.toLowerCase()]
  );

  res.status(200).json({
    status: 'success',
    data: {
      exists: users.length > 0,
      email: email.toLowerCase()
    }
  });
});

// @desc    Get user stats (for dashboard)
// @route   GET /api/auth/stats
// @access  Private
export const getUserStats = asyncHandler(async (req, res, next) => {
  const userId = req.user.userId;

  // Get user stats based on role
  let stats = {};

  if (req.user.role === 'Owner') {
    // Get pet stats for owners
    const [petStats] = await db.execute(
      `SELECT 
        COUNT(*) as total_pets,
        SUM(CASE WHEN is_available = true THEN 1 ELSE 0 END) as available_pets,
        SUM(CASE WHEN is_adopted = true THEN 1 ELSE 0 END) as adopted_pets
       FROM pets WHERE owner_id = ?`,
      [userId]
    );

    // Get adoption request stats
    const [requestStats] = await db.execute(
      `SELECT COUNT(*) as total_requests
       FROM adoption_requests ar
       JOIN pets p ON ar.pet_id = p.pet_id
       WHERE p.owner_id = ?`,
      [userId]
    );

    stats = {
      role: 'Owner',
      pets: petStats[0] || { total_pets: 0, available_pets: 0, adopted_pets: 0 },
      adoptionRequests: requestStats[0].total_requests || 0
    };
  } else {
    // Get adoption stats for adopters
    const [adoptionStats] = await db.execute(
      `SELECT 
        COUNT(*) as total_requests,
        SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending_requests,
        SUM(CASE WHEN status = 'Approved' THEN 1 ELSE 0 END) as approved_requests,
        SUM(CASE WHEN status = 'Rejected' THEN 1 ELSE 0 END) as rejected_requests
       FROM adoption_requests WHERE adopter_id = ?`,
      [userId]
    );

    stats = {
      role: 'Adopter',
      adoptionRequests: adoptionStats[0] || { 
        total_requests: 0, 
        pending_requests: 0, 
        approved_requests: 0, 
        rejected_requests: 0 
      }
    };
  }

  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
});

export default {
  register,
  login,
  getMe,
  updatePassword,
  logout,
  checkEmail,
  getUserStats
};
