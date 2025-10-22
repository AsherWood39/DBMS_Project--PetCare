import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { authenticate } from '../middleware/auth.js';
import {
  addPet,
  getAllPets,
  getAvailablePets,
  getPetById,
  updatePet,
  deletePet
} from '../controllers/petsController.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// use uploads folder inside server/src
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `pet_${Date.now()}${ext}`);
  }
});
export const upload = multer({ storage });

// -------------------
// Public routes
// -------------------
router.get('/', getAllPets);                  // Anyone can view all pets
router.get('/available', getAvailablePets);  // Public can see available pets
router.get('/:id', getPetById);

// -------------------
// Protected routes (owners)
// Add pet (single file named "pet_image")
router.post('/', authenticate, upload.single('pet_image'), addPet);

// Update / delete routes (if used)
router.put('/:id', authenticate, upload.single('pet_image'), updatePet);
router.delete('/:id', authenticate, deletePet);

export default router;