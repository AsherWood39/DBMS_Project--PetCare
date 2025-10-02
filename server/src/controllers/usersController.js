// Users controller for PetCare API - CRUD operations for user data

import bcrypt from 'bcrypt';
import { db } from '../server.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';

// @desc    Get user profile (current user only)
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res, next) => {
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

// @desc    Update user profile (current user only)
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user.userId;
  const { full_name, age, phone, address } = req.validatedData;

  // Build dynamic query based on provided fields
  const updateFields = [];
  const updateValues = [];

  if (full_name !== undefined) {
    updateFields.push('full_name = ?');
    updateValues.push(full_name);
  }
  if (age !== undefined) {
    updateFields.push('age = ?');
    updateValues.push(age);
  }
  if (phone !== undefined) {
    updateFields.push('phone = ?');
    updateValues.push(phone);
  }
  if (address !== undefined) {
    updateFields.push('address = ?');
    updateValues.push(address);
  }

  if (updateFields.length === 0) {
    throw new AppError('No valid fields provided for update', 400);
  }

  // Add updated_at and userId
  updateFields.push('updated_at = CURRENT_TIMESTAMP');
  updateValues.push(userId);

  // Execute update
  const updateQuery = `UPDATE users SET ${updateFields.join(', ')} WHERE user_id = ?`;
  const [result] = await db.execute(updateQuery, updateValues);

  if (result.affectedRows === 0) {
    throw new AppError('User not found', 404);
  }

  // Get updated user data
  const [users] = await db.execute(
    'SELECT user_id, full_name, age, email, role, phone, address, is_active, email_verified, created_at, updated_at FROM users WHERE user_id = ?',
    [userId]
  );

  const user = users[0];

  res.status(200).json({
    status: 'success',
    message: 'Profile updated successfully',
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

// @desc    Delete user account (current user only)
// @route   DELETE /api/users/profile
// @access  Private
export const deleteUserAccount = asyncHandler(async (req, res, next) => {
  try {
    console.log('Attempting to delete user account for user ID:', req.user.userId);

    // Simple approach: Just delete the user record
    // The database schema has CASCADE DELETE foreign key constraints
    // which will automatically delete related records
    const [result] = await db.execute('DELETE FROM users WHERE user_id = ?', [req.user.userId]);
    
    console.log('Delete result:', result);

    if (result.affectedRows === 0) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json({
      status: 'success',
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user account:', error);
    throw error;
  }
});

// @desc    Get user's pets (for owners)
// @route   GET /api/users/pets
// @access  Private
export const getUserPets = asyncHandler(async (req, res, next) => {
  if (req.user.role !== 'Owner') {
    throw new AppError('Only pet owners can access this endpoint', 403);
  }

  const { page = 1, limit = 10, category, is_available } = req.query;
  const offset = (page - 1) * limit;

  // Build WHERE clause
  let whereClause = 'WHERE owner_id = ?';
  const queryParams = [req.user.userId];

  if (category) {
    whereClause += ' AND category = ?';
    queryParams.push(category);
  }

  if (is_available !== undefined) {
    whereClause += ' AND is_available = ?';
    queryParams.push(is_available === 'true');
  }

  // Get pets with pagination
  const [pets] = await db.execute(
    `SELECT pet_id, category, pet_name, breed, age, gender, color, weight, 
            temperament, location, pet_image, diet_preferences, special_notes,
            is_available, is_adopted, created_at, updated_at
     FROM pets 
     ${whereClause}
     ORDER BY created_at DESC
     LIMIT ? OFFSET ?`,
    [...queryParams, parseInt(limit), offset]
  );

  // Get total count
  const [countResult] = await db.execute(
    `SELECT COUNT(*) as total FROM pets ${whereClause}`,
    queryParams
  );

  const totalPets = countResult[0].total;
  const totalPages = Math.ceil(totalPets / limit);

  res.status(200).json({
    status: 'success',
    data: {
      pets,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalPets,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    }
  });
});

// @desc    Get user's adoption requests (for adopters)
// @route   GET /api/users/adoption-requests
// @access  Private
export const getUserAdoptionRequests = asyncHandler(async (req, res, next) => {
  if (req.user.role !== 'Adopter') {
    throw new AppError('Only adopters can access this endpoint', 403);
  }

  const { page = 1, limit = 10, status } = req.query;
  const offset = (page - 1) * limit;

  // Build WHERE clause
  let whereClause = 'WHERE ar.adopter_id = ?';
  const queryParams = [req.user.userId];

  if (status) {
    whereClause += ' AND ar.status = ?';
    queryParams.push(status);
  }

  // Get adoption requests with pet details
  const [requests] = await db.execute(
    `SELECT ar.request_id, ar.pet_id, ar.status, ar.notes, ar.created_at, ar.updated_at,
            p.pet_name, p.category, p.breed, p.age as pet_age, p.location, p.pet_image,
            u.full_name as owner_name, u.email as owner_email, u.phone as owner_phone
     FROM adoption_requests ar
     JOIN pets p ON ar.pet_id = p.pet_id
     JOIN users u ON p.owner_id = u.user_id
     ${whereClause}
     ORDER BY ar.created_at DESC
     LIMIT ? OFFSET ?`,
    [...queryParams, parseInt(limit), offset]
  );

  // Get total count
  const [countResult] = await db.execute(
    `SELECT COUNT(*) as total 
     FROM adoption_requests ar
     JOIN pets p ON ar.pet_id = p.pet_id
     ${whereClause}`,
    queryParams
  );

  const totalRequests = countResult[0].total;
  const totalPages = Math.ceil(totalRequests / limit);

  res.status(200).json({
    status: 'success',
    data: {
      adoptionRequests: requests,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalRequests,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    }
  });
});

// @desc    Update user email verification status
// @route   PATCH /api/users/verify-email
// @access  Private
export const verifyEmail = asyncHandler(async (req, res, next) => {
  // In a real application, you would verify a token sent via email
  // For this demo, we'll just mark the email as verified
  
  await db.execute(
    'UPDATE users SET email_verified = true, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
    [req.user.userId]
  );

  res.status(200).json({
    status: 'success',
    message: 'Email verified successfully'
  });
});

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private
export const getUserStats = asyncHandler(async (req, res, next) => {
  const userId = req.user.userId;
  const userRole = req.user.role;

  let stats = {
    role: userRole,
    joinDate: null,
    totalActivity: 0
  };

  // Get user join date
  const [userInfo] = await db.execute(
    'SELECT created_at FROM users WHERE user_id = ?',
    [userId]
  );

  if (userInfo.length > 0) {
    stats.joinDate = userInfo[0].created_at;
  }

  if (userRole === 'Owner') {
    // Get owner statistics
    const [ownerStats] = await db.execute(
      `SELECT 
        COUNT(p.pet_id) as total_pets,
        SUM(CASE WHEN p.is_available = true THEN 1 ELSE 0 END) as available_pets,
        SUM(CASE WHEN p.is_adopted = true THEN 1 ELSE 0 END) as adopted_pets,
        COUNT(ar.request_id) as total_requests
       FROM pets p
       LEFT JOIN adoption_requests ar ON p.pet_id = ar.pet_id
       WHERE p.owner_id = ?`,
      [userId]
    );

    stats = {
      ...stats,
      pets: ownerStats[0] || { total_pets: 0, available_pets: 0, adopted_pets: 0 },
      adoptionRequests: ownerStats[0]?.total_requests || 0,
      totalActivity: (ownerStats[0]?.total_pets || 0) + (ownerStats[0]?.total_requests || 0)
    };
  } else {
    // Get adopter statistics
    const [adopterStats] = await db.execute(
      `SELECT 
        COUNT(*) as total_requests,
        SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending_requests,
        SUM(CASE WHEN status = 'Approved' THEN 1 ELSE 0 END) as approved_requests,
        SUM(CASE WHEN status = 'Rejected' THEN 1 ELSE 0 END) as rejected_requests
       FROM adoption_requests 
       WHERE adopter_id = ?`,
      [userId]
    );

    stats = {
      ...stats,
      adoptionRequests: adopterStats[0] || { 
        total_requests: 0, 
        pending_requests: 0, 
        approved_requests: 0, 
        rejected_requests: 0 
      },
      totalActivity: adopterStats[0]?.total_requests || 0
    };
  }

  res.status(200).json({
    status: 'success',
    data: { stats }
  });
});

// @desc    Change user role (admin function - for demo purposes)
// @route   PATCH /api/users/change-role
// @access  Private
export const changeUserRole = asyncHandler(async (req, res, next) => {
  const { newRole } = req.body;

  if (!newRole || !['Adopter', 'Owner'].includes(newRole)) {
    throw new AppError('Invalid role. Must be either "Adopter" or "Owner"', 400);
  }

  if (req.user.role === newRole) {
    throw new AppError(`You are already a ${newRole}`, 400);
  }

  await db.execute(
    'UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
    [newRole, req.user.userId]
  );

  res.status(200).json({
    status: 'success',
    message: `Role changed to ${newRole} successfully`,
    data: {
      newRole
    }
  });
});

export default {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
  getUserPets,
  getUserAdoptionRequests,
  verifyEmail,
  getUserStats,
  changeUserRole
};