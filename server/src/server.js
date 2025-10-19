import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import app from './app.js';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express'; // { added }

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

// Validate required environment variables before attempting DB connection
const requiredEnv = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const missing = requiredEnv.filter((k) => !process.env[k]);
if (missing.length > 0) {
  console.error('❌ Missing required environment variables:', missing.join(', '));
  console.error('Please create a .env file in the server directory (see .env.example) and set these values.');
  process.exit(1);
}

// Database connection pool (mysql2 - only supported options).
export const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Use connectTimeout (ms) for initial connection timeout
  connectTimeout: process.env.DB_CONNECT_TIMEOUT ? parseInt(process.env.DB_CONNECT_TIMEOUT, 10) : 10000
});

// Test database connection
async function testConnection() {
  try {
    const connection = await db.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}

// Start server
async function startServer() {
  try {
    await testConnection();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Database: ${process.env.DB_NAME}@${process.env.DB_HOST}:${process.env.DB_PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  try {
    await db.end();
    console.log('✅ Database connections closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve uploaded images (ensure this runs before routes that reference /uploads)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

startServer();
