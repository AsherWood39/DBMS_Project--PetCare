// Authentication routes for PetCare API

import express from 'express';
import {
  register,
  login,
  getMe,
  updatePassword,
  logout,
  checkEmail,
  getUserStats
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import {
  validateUserRegistration,
  validateUserLogin
} from '../utils/validation.js';

const router = express.Router();

// Public routes
router.post('/register', validateUserRegistration, register);
router.post('/login', validateUserLogin, login);
router.post('/check-email', checkEmail);

// Protected routes (require authentication)
router.use(authenticate); // All routes below this middleware require authentication

router.get('/me', getMe);
router.post('/logout', logout);
router.put('/update-password', updatePassword);
router.get('/stats', getUserStats);

export default router;
