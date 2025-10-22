import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { db } from '../server.js'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @desc Add a new pet (Owner only)
 * @route POST /api/pets
 * @access Private
 */
export const addPet = asyncHandler(async (req, res) => {
  try {
    console.log('addPet: req.file =', req.file);
    console.log('addPet: req.files =', req.files);
    // extract filename robustly (support single or fields)
    let filename = null;
    if (req.file && req.file.filename) {
      filename = req.file.filename;
    } else if (req.files) {
      if (Array.isArray(req.files.pet_image) && req.files.pet_image[0]?.filename) {
        filename = req.files.pet_image[0].filename;
      } else {
        const firstKey = Object.keys(req.files)[0];
        if (firstKey && Array.isArray(req.files[firstKey]) && req.files[firstKey][0]?.filename) {
          filename = req.files[firstKey][0].filename;
        }
      }
    }

    // sanity check file exists on disk (server/src/uploads)
    if (filename) {
      const savedPath = path.join(__dirname, 'uploads', filename);
      if (!fs.existsSync(savedPath)) {
        console.warn('addPet: expected uploaded file not found on disk:', savedPath);
      }
    }

    // Build pet_image DB value as a public path
    const petImageValue = filename ? `/uploads/${filename}` : null;

    // collect fields from req.body (adjust names as your form sends)
    const {
      category, pet_name, breed, age, gender, color, weight,
      temperament, location, diet_preferences, special_notes,
      is_available, is_adopted, owner_name, owner_contact, owner_email
    } = req.body;

    const sql = `INSERT INTO pets
  (category, pet_name, breed, age, gender, color, weight, temperament, location,
   diet_preferences, special_notes, is_available, is_adopted, owner_id, pet_image, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`;

const values = [
  category || null,
  pet_name || null,
  breed || null,
  age ? Number(age) : null,
  gender || null,
  color || null,
  weight ? Number(weight) : null,
  temperament || null,
  location || null,
  diet_preferences || null,
  special_notes || null,
  is_available === 'on' || is_available === '1' || is_available === 1 || is_available === true ? 1 : 1, // default to 1
  is_adopted === 'on' || is_adopted === '1' || is_adopted === 1 || is_adopted === true ? 1 : 0,
  req.user?.userId || null,
  petImageValue
];


    const [result] = await db.query(sql, values);
    return res.status(201).json({ status: 'success', petId: result.insertId });
  } catch (err) {
    console.error('addPet error:', err);
    return res.status(500).json({ status: 'error', message: 'Failed to add pet', detail: err.message });
  }
});

/**
 * @desc Get all pets
 * @route GET /api/pets
 * @access Public
 */
export const getAllPets = asyncHandler(async (req, res, next) => {
  const [rows] = await db.query(`
    SELECT p.*, u.full_name AS owner_name, u.phone AS owner_phone, u.email AS owner_email
FROM pets p
LEFT JOIN users u ON p.owner_id = u.user_id

  `);

  const pets = rows.map(pet => ({
    ...pet,
    pet_image: pet.pet_image
      ? (pet.pet_image.startsWith('/uploads') ? pet.pet_image : `/uploads/${pet.pet_image}`)
      : '/uploads/default-pet.png'
  }));

  res.status(200).json({
    status: 'success',
    data: pets
  });
});

/**
 * @desc Get single pet by ID
 * @route GET /api/pets/:id
 * @access Public
 */
export const getPetById = asyncHandler(async (req, res) => {
  const petId = req.params.id;
  const [rows] = await db.query(
    `SELECT p.*, u.full_name AS owner_name, u.phone AS owner_phone, u.email AS owner_email
     FROM pets p
     LEFT JOIN users u ON p.owner_id = u.user_id
     WHERE p.pet_id = ?
     LIMIT 1`,
    [petId]
  );
  if (!rows || rows.length === 0) return res.status(404).json({ status: 'fail', message: 'Pet not found' });
  const pet = rows[0];
  if (pet.pet_image && !String(pet.pet_image).startsWith('/uploads') && !/^(https?:|data:|blob:)/i.test(pet.pet_image)) {
    pet.pet_image = `/uploads/${String(pet.pet_image).replace(/^\/+/, '')}`;
  }
  return res.status(200).json({ status: 'success', data: pet });
});

/**
 * @desc Update pet (Owner only)
 * @route PUT /api/pets/:id
 * @access Private
 */
export const updatePet = asyncHandler(async (req, res, next) => {
  const petId = req.params.id;

  // Verify ownership
  const [check] = await db.query('SELECT * FROM pets WHERE pet_id = ? AND owner_id = ?', [
    petId,
    req.user.userId
  ]);

  if (!check.length) throw new AppError('Pet not found or not owned by you', 404);

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

  updatable.forEach(field => {
    if (req.body[field] !== undefined) {
      fields.push(`${field} = ?`);
      values.push(req.body[field]);
    }
  });

  if (req.file) {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const safeFileName = Date.now() + '-' + req.file.originalname.replace(/\s+/g, '_');
    const newPath = path.join(uploadDir, safeFileName);
    fs.renameSync(req.file.path, newPath);

    fields.push('pet_image = ?');
    values.push(`/uploads/${safeFileName}`);
  }

  if (fields.length === 0) throw new AppError('No fields provided for update', 400);

  values.push(petId, req.user.userId);

  const sql = `
    UPDATE pets 
    SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP 
    WHERE pet_id = ? AND owner_id = ?
  `;

  await db.query(sql, values);

  res.status(200).json({ status: 'success', message: 'Pet updated successfully' });
});

/**
 * @desc Delete pet (Owner only)
 * @route DELETE /api/pets/:id
 * @access Private
 */
export const deletePet = asyncHandler(async (req, res, next) => {
  const [result] = await db.query('DELETE FROM pets WHERE pet_id = ? AND owner_id = ?', [
    req.params.id,
    req.user.userId
  ]);

  if (result.affectedRows === 0) throw new AppError('Pet not found or not owned by you', 404);

  res.status(200).json({
    status: 'success',
    message: 'Pet deleted successfully'
  });
});

/**
 * @desc Get available pets
 * @route GET /api/pets/available
 * @access Public
 */
export const getAvailablePets = asyncHandler(async (req, res, next) => {
  const [pets] = await db.query('SELECT * FROM pets WHERE is_available = 1 ORDER BY created_at DESC');
  res.status(200).json({
    status: 'success',
    data: pets
  });
});

/**
 * @desc Get logged-in owner's pets
 * @route GET /api/pets/my-pets
 * @access Private
 */
export const getUserPets = asyncHandler(async (req, res, next) => {
  if (req.user.role !== 'Owner') throw new AppError('Only owners can view their pets', 403);

  const [pets] = await db.query('SELECT * FROM pets WHERE owner_id = ? ORDER BY created_at DESC', [
    req.user.userId
  ]);

  res.status(200).json({
    status: 'success',
    data: pets
  });
});

/**
 * Async error handler wrapper
 */
function asyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export default {
  addPet,
  getAllPets,
  getPetById,
  updatePet,
  deletePet,
  getAvailablePets,
  getUserPets
};
