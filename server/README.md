# 🗄️ PetCare Database Setup Guide

This directory contains the MySQL database schema and setup files for the PetCare application.

## 📁 Files Overview

- `petcare_schema.sql` — Complete database schema (tables, views, procedures, triggers)
- `sample_data.sql` — Sample data for testing and development
- `README.md` — This setup guide

## 🚀 Quick Setup

### Prerequisites

- MySQL 8.0 or higher
- MySQL Workbench (recommended) or command line access
- Root/admin privileges to create databases

### Installation Steps

1. **Start MySQL Service**
   ```bash
   # Windows
   net start mysql

   # Linux/Mac
   sudo systemctl start mysql
   # or
   sudo service mysql start
   ```

2. **Connect to MySQL**
   ```bash
   mysql -u root -p
   ```

3. **Run the Schema Script**
   ```sql
   source /path/to/petcare_schema.sql;
   ```
   Or copy and paste the contents of `petcare_schema.sql` into your MySQL client.

4. **Verify Installation**
   ```sql
   USE petcare_db;
   SHOW TABLES;
   ```

## 📊 Database Structure

### Core Tables

| Table                | Purpose                        | Key Features                                 |
|----------------------|-------------------------------|----------------------------------------------|
| `users`              | User accounts and profiles    | Role-based access (Adopter/Owner/Admin)      |
| `pets`               | Pet listings and information  | Category support (Dog/Cat/Bird)              |
| `adoption_requests`  | Adoption applications         | Comprehensive form data                      |
| `adoptions`          | Completed adoptions           | Links requests to final adoption             |
| `pet_health_records` | Pet health information        | Medical history tracking                     |
| `vaccinations`       | Vaccination records           | Certificate file storage                     |

### Supporting Tables

| Table            | Purpose                |
|------------------|-----------------------|
| `messages`       | User communication    |
| `favorites`      | User favorite pets    |
| `system_settings`| App configuration     |
| `audit_logs`     | Action tracking       |

## 🔧 Configuration

### Create Application User

```sql
CREATE USER 'petcare_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON petcare_db.* TO 'petcare_user'@'localhost';
FLUSH PRIVILEGES;
```

### Environment Variables

Add these to your application's environment configuration:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=petcare_db
DB_USER=petcare_user
DB_PASSWORD=your_secure_password
```

## 📈 Performance Optimization

### Indexes

Optimized indexes for:
- User lookups by email and role
- Pet searches by category and availability
- Adoption request filtering by status
- Message queries by user and read status

### Views

Pre-built views for common queries:
- `available_pets_view` — Pets available for adoption with owner info
- `adoption_requests_view` — Adoption requests with pet and user details

## 🛠️ Stored Procedures

### Available Procedures

1. **ApproveAdoptionRequest**
   ```sql
   CALL ApproveAdoptionRequest(request_id, adoption_fee, admin_notes);
   ```

2. **RejectAdoptionRequest**
   ```sql
   CALL RejectAdoptionRequest(request_id, rejection_reason, admin_notes);
   ```

## 🔍 Common Queries

### Get Available Pets
```sql
SELECT * FROM available_pets_view 
WHERE category = 'Dog' 
ORDER BY created_at DESC;
```

### Get User's Adoption Requests
```sql
SELECT * FROM adoption_requests_view 
WHERE adopter_id = ? 
ORDER BY created_at DESC;
```

### Get Pet Health Records
```sql
SELECT p.*, h.*, v.*
FROM pets p
LEFT JOIN pet_health_records h ON p.pet_id = h.pet_id
LEFT JOIN vaccinations v ON p.pet_id = v.pet_id
WHERE p.pet_id = ?;
```

## 🔒 Security Considerations

1. Password Hashing: Use bcrypt or similar
2. SQL Injection: Use prepared statements
3. Access Control: Implement role-based permissions
4. Data Validation: Validate all input data
5. Backup Strategy: Regular database backups

## 📊 Sample Data

Includes sample data for testing:
- 3 sample users (1 admin, 2 regular users)
- 3 sample pets (1 dog, 1 cat, 1 bird)
- Complete health records and vaccinations
- Sample adoption requests

## 🚨 Troubleshooting

### Common Issues

1. **Connection Refused**
   - Check MySQL service is running
   - Verify port 3306 is open
   - Check firewall settings

2. **Access Denied**
   - Verify username and password
   - Check user privileges
   - Ensure database exists

3. **Table Already Exists**
   - Drop existing tables: `DROP DATABASE petcare_db;`
   - Re-run the schema script

### Reset Database

```sql
DROP DATABASE IF EXISTS petcare_db;
-- Then re-run the schema script
```

## 📝 Maintenance

### Regular Tasks

1. **Backup Database**
   ```bash
   mysqldump -u root -p petcare_db > petcare_backup.sql
   ```

2. **Monitor Performance**
   ```sql
   SHOW PROCESSLIST;
   EXPLAIN SELECT * FROM pets WHERE category = 'Dog';
   ```

3. **Update Statistics**
   ```sql
   ANALYZE TABLE pets, users, adoption_requests;
   ```

## 🔄 Migration Scripts

For future updates, create migration scripts:

```sql
-- Example: Add new column
ALTER TABLE pets ADD COLUMN microchip_id VARCHAR(50) UNIQUE;

-- Example: Add new index
CREATE INDEX idx_pets_microchip ON pets(microchip_id);
```

## 📞 Support

For database-related issues:
1. Check MySQL error logs
2. Verify table structure with `DESCRIBE table_name`
3. Test queries in MySQL Workbench
4. Check application connection settings

---

**Database Version**: 1.0.0  
**Last Updated**: 2024  
**Compatible with**: MySQL 8.0+

---

## 📁 File Structure & Functions

### 🚀 Core Server Files

- `server.js` — Main entry point; starts server, connects to MySQL, handles graceful shutdown
- `app.js` — Express app configuration (CORS, middleware, route mounting, error handling)

### 🔐 Authentication & Security

- `middleware/auth.js` — JWT token generation/verification, authentication middleware, role-based authorization
- `controllers/authController.js` — User registration, login, password updates, user stats, email checking

### 👤 User Management

- `controllers/usersController.js` — CRUD for user profiles, role management, user statistics
- `routes/users.js` — User-specific routes with authentication and authorization

### 🛡️ Security & Validation

- `utils/validation.js` — Input validation, sanitization, middleware for user inputs
- `middleware/errorHandler.js` — Error handling with custom error classes, database error handling

### 🌐 API Routes

- `routes/auth.js` — Authentication routes (register, login, logout, password updates)
- `routes/users.js` — User management routes with role-based access control

### ✨ Key Features Implemented

#### 🔑 Authentication System

- User registration with password hashing (bcrypt)
- JWT-based authentication with secure tokens
- Login/logout functionality
- Password update with current password verification
- Role-based access control (Owner/Adopter)

#### 👥 User Management

- Profile CRUD operations
- Account deactivation (not hard delete)
- Email verification system
- User statistics dashboard
- Role switching functionality

#### 🛡️ Security Features

- Password hashing with bcrypt (12 salt rounds)
- JWT tokens with expiration
- Input validation and sanitization
- SQL injection protection
- CORS configuration
- Error handling without exposing sensitive data

#### 📊 Advanced Features

- Pagination support for user data
- Database connection pooling
- Transaction support for critical operations
- Comprehensive error logging
- Health check endpoints
- Development vs production configurations

### 🔌 API Endpoints Available

#### Authentication (`/api/auth`):

- `POST /register` — Register new user
- `POST /login` — User login
- `GET /me` — Get current user
- `POST /logout` — Logout user
- `PUT /update-password` — Change password
- `POST /check-email` — Check if email exists
- `GET /stats` — Get user dashboard stats

#### Users (`/api/users`):

- `GET /profile` — Get user profile
- `PUT /profile` — Update user profile
- `DELETE /profile` — Delete/deactivate account
- `GET /stats` — Get user statistics
- `PATCH /verify-email` — Verify email
- `PATCH /change-role` — Change user role
- `GET /pets` — Get user's pets (Owner only)
- `GET /adoption-requests` — Get adoption requests (Adopter only)

### ⚙️ Environment Configuration

- Database connection settings
- JWT secrets and expiration
- Port configuration
- Development/production mode settings

### 🚀 How to Start

Install dependencies:

```bash
npm install
```

Start the server:

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

Server will run on: [http://localhost:5000](http://localhost:5000)

### 📡 Client Integration

- CORS enabled for common development ports
- JSON response format consistent with frontend expectations
- Proper HTTP status codes
- Comprehensive error messages

All files are production-ready with proper error handling, validation, security measures, and are fully integrated to work seamlessly together! The server will now properly handle all authentication, user management, and database operations for your PetCare application. 🐾