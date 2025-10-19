import express from 'express';
import cors from 'cors';                      // { added }
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv'; // { added }
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import petRoutes from './routes/pets.js'; 
import adoptionRequestRoutes from './routes/adoptionRequests.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security headers
app.use((req, res, next) => {
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/adoption-requests', adoptionRequestRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'PetCare API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to PetCare API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      users: '/api/users',
      pets: '/api/pets'
    }
  });
});

// Serve uploaded images early so /uploads/* is not swallowed by client static / SPA handler
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Serve static files from the client dist directory
app.use(express.static(path.join(__dirname, '../../client/dist')));

// Handle 404 routes
app.use('*', (req, res) => {
  // If the request is an API request, return JSON
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({
      status: 'error',
      message: `Route ${req.originalUrl} not found`
    });
  }
  
  // For non-API requests, serve the 404.html page using an absolute path
  return res.status(404).sendFile(path.join(__dirname, '../../client/dist/pages/404.html'));
});

// Global error handler (must be last middleware)
app.use(errorHandler);

export default app;
