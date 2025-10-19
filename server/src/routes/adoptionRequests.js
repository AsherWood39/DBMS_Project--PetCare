import express from 'express';
import { createAdoptionRequest } from '../controllers/adoptionRequestsController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Protected: create a new adoption request (adopters must be logged in)
router.post('/', authenticate, createAdoptionRequest);

export default router;

