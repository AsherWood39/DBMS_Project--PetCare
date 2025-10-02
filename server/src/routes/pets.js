import express from 'express';
import multer from 'multer';
import {
  addPet,
  getAllPets,
  getPetById,
  updatePet,
  deletePet,
  getAvailablePets,
  getUserPets
} from '../controllers/petsController.js';
import { authenticate, authorizeOwnership } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// -------------------
// Public routes
// -------------------
router.get('/', getAllPets);                  // Anyone can view all pets
router.get('/available', getAvailablePets);  // Public can see available pets
router.get('/:id', getPetById);              // Anyone can view details of one pet

// -------------------
// Protected routes (require login)
// -------------------
router.post('/', authenticate, upload.single('pet_image'), addPet);  // Add new pet
router.put('/:id', authenticate, authorizeOwnership('userId'), upload.single('pet_image'), updatePet); // Update pet
router.delete('/:id', authenticate, authorizeOwnership('userId'), deletePet); // Delete pet
router.get('/my-pets', authenticate, getUserPets);  // Get pets added by logged-in user

export default router;
