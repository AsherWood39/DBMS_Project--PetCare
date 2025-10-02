import express from 'express';
import { addPet } from '../controllers/petsController.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Use .single('pet_image') because your HTML input uses name="pet_image"
router.post('/pets', upload.single('pet_image'), addPet);

export default router;
