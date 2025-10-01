// User routes for PetCare API

import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
  getUserPets,
  getUserAdoptionRequests,
  verifyEmail,
  getUserStats,
  changeUserRole
} from '../controllers/usersController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validateUserUpdate } from '../utils/validation.js';

const router = express.Router();

// All user routes require authentication
router.use(authenticate);

// Profile management routes
router.route('/profile')
  .get(getUserProfile)
  .put(validateUserUpdate, updateUserProfile)
  .delete(deleteUserAccount);

// User statistics
router.get('/stats', getUserStats);

// Email verification
router.patch('/verify-email', verifyEmail);

// Role management
router.patch('/change-role', changeUserRole);

// Owner-specific routes
router.get('/pets', authorize('Owner'), getUserPets);

// Adopter-specific routes
router.get('/adoption-requests', authorize('Adopter'), getUserAdoptionRequests);

export default router;
