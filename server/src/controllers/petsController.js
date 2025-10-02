import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from '../server.js'; // MySQL connection
import { AppError, asyncHandler } from '../middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Add a new pet (Owner only)
// @route   POST /api/pets
// @access  Private
export const addPet = asyncHandler(async (req, res, next) => {
  const {
    category,
    pet_name,
    breed,
    age,
    gender,
    color,
    weight,
    temperament,
    location,
    diet_preferences,
    special_notes,
    is_available,
    is_adopted
  } = req.body;

  let pet_image = '';
  if (req.file) {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    const newPath = path.join(uploadDir, req.file.originalname);
    fs.renameSync(req.file.path, newPath);
    pet_image = `/uploads/${req.file.originalname}`;
  }

  const sql = `
    INSERT INTO pets (
      owner_id, category, pet_name, breed, age, gender, color, weight,
      temperament, location, pet_image, diet_preferences, special_notes,
      is_available, is_adopted
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    req.user.userId, // owner_id comes from logged-in user
    category,
    pet_name,
    breed,
    age,
    gender,
    color,
    weight,
    temperament,
    location,
    pet_image,
    diet_preferences,
    special_notes,
    is_available === 'true' || is_available === true ? 1 : 0,
    is_adopted === 'true' || is_adopted === true ? 1 : 0
  ];

  await db.query(sql, params);

  res.status(201).json({
    status: 'success',
    message: 'Pet posted successfully'
  });
});

// @desc    Get all pets
// @route   GET /api/pets
// @access  Public
export const getAllPets = asyncHandler(async (req, res, next) => {
  const [pets] = await db.query('SELECT * FROM pets ORDER BY created_at DESC');
  res.status(200).json({ status: 'success', data: pets });
});

// @desc    Get single pet by ID
// @route   GET /api/pets/:id
// @access  Public
export const getPetById = asyncHandler(async (req, res, next) => {
  const [pets] = await db.query('SELECT * FROM pets WHERE pet_id = ?', [req.params.id]);

  if (pets.length === 0) throw new AppError('Pet not found', 404);

  res.status(200).json({ status: 'success', data: pets[0] });
});

// @desc    Update pet (Owner only)
// @route   PUT /api/pets/:id
// @access  Private
export const updatePet = asyncHandler(async (req, res, next) => {
  const petId = req.params.id;

  // Ensure pet belongs to logged-in owner
  const [check] = await db.query('SELECT * FROM pets WHERE pet_id = ? AND owner_id = ?', [
    petId,
    req.user.userId
  ]);
  if (check.length === 0) throw new AppError('Pet not found or not owned by you', 404);

  const fields = [];
  const values = [];

  const updatable = [
    'category',
    'pet_name',
    'breed',
    'age',
    'gender',
    'color',
    'weight',
    'temperament',
    'location',
    'diet_preferences',
    'special_notes',
    'is_available',
    'is_adopted'
  ];

  updatable.forEach((field) => {
    if (req.body[field] !== undefined) {
      fields.push(`${field} = ?`);
      values.push(req.body[field]);
    }
  });

  if (req.file) {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    const newPath = path.join(uploadDir, req.file.originalname);
    fs.renameSync(req.file.path, newPath);
    fields.push('pet_image = ?');
    values.push(`/uploads/${req.file.originalname}`);
  }

  if (fields.length === 0) throw new AppError('No fields provided for update', 400);

  values.push(petId, req.user.userId);

  const sql = `UPDATE pets SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE pet_id = ? AND owner_id = ?`;
  await db.query(sql, values);

  res.status(200).json({ status: 'success', message: 'Pet updated successfully' });
});

// @desc    Delete pet (Owner only)
// @route   DELETE /api/pets/:id
// @access  Private
export const deletePet = asyncHandler(async (req, res, next) => {
  const [result] = await db.query('DELETE FROM pets WHERE pet_id = ? AND owner_id = ?', [
    req.params.id,
    req.user.userId
  ]);

  if (result.affectedRows === 0) throw new AppError('Pet not found or not owned by you', 404);

  res.status(200).json({ status: 'success', message: 'Pet deleted successfully' });
});

// @desc    Get available pets
// @route   GET /api/pets/available
// @access  Public
export const getAvailablePets = asyncHandler(async (req, res, next) => {
  const [pets] = await db.query('SELECT * FROM pets WHERE is_available = 1 ORDER BY created_at DESC');
  res.status(200).json({ status: 'success', data: pets });
});

// @desc    Get logged-in user's pets (Owner only)
// @route   GET /api/pets/my-pets
// @access  Private
export const getUserPets = asyncHandler(async (req, res, next) => {
  if (req.user.role !== 'Owner') throw new AppError('Only owners can view their pets', 403);

  const [pets] = await db.query('SELECT * FROM pets WHERE owner_id = ? ORDER BY created_at DESC', [
    req.user.userId
  ]);

  res.status(200).json({ status: 'success', data: pets });
});

export default {
  addPet,
  getAllPets,
  getPetById,
  updatePet,
  deletePet,
  getAvailablePets,
  getUserPets
};
