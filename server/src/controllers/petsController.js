import db from '../app.js'; // your MySQL connection
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function addPet(req, res) {
  try {
    console.log('req.body:', req.body);
    console.log('req.file:', req.file);

    const {
      owner_id, category, pet_name, breed, age, gender, color, weight,
      temperament, location, diet_preferences, special_notes, is_available, is_adopted
    } = req.body;

    let pet_image = '';
    if (req.file) {
      const uploadDir = path.join(__dirname, '../../uploads');
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
      const newPath = path.join(uploadDir, req.file.originalname);
      fs.renameSync(req.file.path, newPath);
      pet_image = newPath;
    }

    const sql = `
      INSERT INTO pets (
        owner_id, category, pet_name, breed, age, gender, color, weight,
        temperament, location, pet_image, diet_preferences, special_notes,
        is_available, is_adopted
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
  owner_id,
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
  is_available === 'true' || is_available === true ? 1 : 0, // convert to 1/0
  is_adopted === 'true' || is_adopted === true ? 1 : 0      // convert to 1/0
];

    await db.query(sql, params);

    res.status(201).json({ message: 'Pet posted successfully.' });
  } catch (err) {
    console.error('Error posting pet:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
}
