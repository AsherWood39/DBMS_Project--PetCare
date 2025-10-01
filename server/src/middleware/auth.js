// Authentication middleware for PetCare API

import jwt from 'jsonwebtoken';
import { db } from '../server.js';
import { AppError, asyncHandler } from './errorHandler.js';

// JWT Secret (in production, this should be in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Generate JWT token
export const generateToken = (userId, email) => {
  return jwt.sign(
    { 
      userId, 
      email,
      iat: Math.floor(Date.now() / 1000)
    },
    JWT_SECRET,
    { 
      expiresIn: JWT_EXPIRES_IN,
      issuer: 'petcare-api',
      audience: 'petcare-clients'
    }
  );
};

// Verify JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: 'petcare-api',
      audience: 'petcare-clients'
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new AppError('Token has expired. Please log in again.', 401);
    }
    if (error.name === 'JsonWebTokenError') {
      throw new AppError('Invalid token. Please log in again.', 401);
    }
    throw new AppError('Token verification failed', 401);
  }
};

// Middleware to authenticate user
export const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  // Get token from header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    throw new AppError('Access denied. No token provided.', 401);
  }

  try {
    // Verify token
    const decoded = verifyToken(token);
    
    // Get user from database
    const [users] = await db.execute(
      'SELECT user_id, full_name, email, role, is_active FROM users WHERE user_id = ? AND is_active = true',
      [decoded.userId]
    );

    if (users.length === 0) {
      throw new AppError('User not found or account deactivated', 401);
    }

    const user = users[0];

    // Check if user is still active
    if (!user.is_active) {
      throw new AppError('Account has been deactivated', 401);
    }

    // Add user to request object
    req.user = {
      userId: user.user_id,
      fullName: user.full_name,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    // If it's already an AppError, pass it through
    if (error instanceof AppError) {
      throw error;
    }
    
    // Handle JWT-specific errors
    if (error.name === 'TokenExpiredError') {
      throw new AppError('Token has expired. Please log in again.', 401);
    }
    if (error.name === 'JsonWebTokenError') {
      throw new AppError('Invalid token. Please log in again.', 401);
    }

    throw new AppError('Authentication failed', 401);
  }
});

// Middleware to check user roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError(`Access denied. Required role: ${roles.join(' or ')}`, 403);
    }

    next();
  };
};

// Middleware to check if user owns the resource
export const authorizeOwnership = (userIdField = 'userId') => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    // Get the user ID from request parameters or body
    const resourceUserId = req.params[userIdField] || req.body[userIdField];
    
    if (!resourceUserId) {
      throw new AppError('Resource user ID not provided', 400);
    }

    // Check if the authenticated user is the owner or has admin role
    if (parseInt(resourceUserId) !== req.user.userId && req.user.role !== 'Admin') {
      throw new AppError('Access denied. You can only access your own resources.', 403);
    }

    next();
  });
};

// Middleware to generate and send token response
export const sendTokenResponse = (user, statusCode, res, message = 'Authentication successful') => {
  const token = generateToken(user.user_id, user.email);

  // Create cookie options
  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      status: 'success',
      message,
      token,
      data: {
        user: {
          id: user.user_id,
          fullName: user.full_name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          address: user.address,
          isActive: user.is_active,
          emailVerified: user.email_verified,
          createdAt: user.created_at
        }
      }
    });
};

// Middleware to extract token from cookie
export const extractTokenFromCookie = (req, res, next) => {
  if (!req.headers.authorization && req.cookies && req.cookies.token) {
    req.headers.authorization = `Bearer ${req.cookies.token}`;
  }
  next();
};

// Optional authentication middleware (doesn't throw error if no token)
export const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  // Get token from header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // If no token, continue without authentication
  if (!token) {
    return next();
  }

  try {
    // Verify token
    const decoded = verifyToken(token);
    
    // Get user from database
    const [users] = await db.execute(
      'SELECT user_id, full_name, email, role, is_active FROM users WHERE user_id = ? AND is_active = true',
      [decoded.userId]
    );

    if (users.length > 0) {
      const user = users[0];
      req.user = {
        userId: user.user_id,
        fullName: user.full_name,
        email: user.email,
        role: user.role
      };
    }
  } catch (error) {
    // Don't throw error for optional auth, just continue without user
    console.log('Optional auth failed:', error.message);
  }

  next();
});

export default {
  authenticate,
  authorize,
  authorizeOwnership,
  generateToken,
  verifyToken,
  sendTokenResponse,
  extractTokenFromCookie,
  optionalAuth
};
