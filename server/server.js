import express from 'express';
import cors from 'cors';
import petRoutes from './src/routes/pets.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // serve uploaded images

app.use('/api', petRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));
