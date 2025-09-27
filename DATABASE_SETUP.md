# 🗄️ PetCare Database Setup Guide

This guide will help you set up the MySQL database for your PetCare application.

## 📋 Prerequisites

- MySQL 8.0 or higher installed
- MySQL Workbench (recommended) or command line access
- Admin/root privileges to create databases
- Node.js and npm (for the frontend)

## 🚀 Quick Setup

### Step 1: Install MySQL

**Windows:**
1. Download MySQL Installer from [mysql.com](https://dev.mysql.com/downloads/installer/)
2. Run the installer and follow the setup wizard
3. Remember your root password

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

**macOS:**
```bash
brew install mysql
brew services start mysql
```

### Step 2: Create Database

1. **Start MySQL Service:**
   ```bash
   # Windows
   net start mysql
   
   # Linux/Mac
   sudo systemctl start mysql
   ```

2. **Connect to MySQL:**
   ```bash
   mysql -u root -p
   ```

3. **Run the Schema Script:**
   ```sql
   source /path/to/database/petcare_schema.sql;
   ```
   
   Or copy and paste the contents of `database/petcare_schema.sql` into your MySQL client.

### Step 3: Create Application User

```sql
-- Create dedicated user for the application
CREATE USER 'petcare_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON petcare_db.* TO 'petcare_user'@'localhost';
FLUSH PRIVILEGES;
```

### Step 4: Load Sample Data (Optional)

```sql
source /path/to/database/sample_data.sql;
```

### Step 5: Verify Installation

```sql
USE petcare_db;
SHOW TABLES;
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM pets;
```

## 🔧 Configuration

### Update Database Connection

1. **Edit the database utility file:**
   ```javascript
   // In client/utils/database.js
   const DB_CONFIG = {
       host: 'localhost',
       port: 3306,
       database: 'petcare_db',
       user: 'petcare_user',
       password: 'your_actual_password', // Update this
       charset: 'utf8mb4'
   };
   ```

2. **Update API endpoints:**
   ```javascript
   // In client/utils/database.js
   const API_ENDPOINTS = {
       base: 'http://localhost:3000/api', // Update with your backend URL
       // ... rest of endpoints
   };
   ```

## 📊 Database Structure Overview

### Core Tables

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `users` | User accounts | user_id, email, role, full_name |
| `pets` | Pet listings | pet_id, owner_id, category, pet_name |
| `adoption_requests` | Adoption applications | request_id, pet_id, adopter_id, status |
| `adoptions` | Completed adoptions | adoption_id, request_id, pet_id, adopter_id |
| `pet_health_records` | Pet health info | health_record_id, pet_id, is_dewormed |
| `vaccinations` | Vaccination records | vaccination_id, pet_id, vaccine_name |

### Relationships

```
users (1) -----> (many) pets
users (1) -----> (many) adoption_requests
pets (1) -----> (1) pet_health_records
pets (1) -----> (many) vaccinations
pets (1) -----> (many) adoption_requests
adoption_requests (1) -----> (1) adoptions
```

## 🛠️ Backend Integration

### Node.js with Express Example

```javascript
// server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'petcare_user',
    password: 'your_password',
    database: 'petcare_db'
});

// API Routes
app.get('/api/pets', (req, res) => {
    const query = 'SELECT * FROM available_pets_view';
    db.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.post('/api/pets', (req, res) => {
    const { category, pet_name, breed, age, gender, color, weight, temperament, location } = req.body;
    const query = 'INSERT INTO pets (owner_id, category, pet_name, breed, age, gender, color, weight, temperament, location) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    
    db.query(query, [1, category, pet_name, breed, age, gender, color, weight, temperament, location], (err, result) => {
        if (err) throw err;
        res.json({ id: result.insertId, message: 'Pet created successfully' });
    });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
```

### PHP Backend Example

```php
<?php
// config/database.php
$host = 'localhost';
$dbname = 'petcare_db';
$username = 'petcare_user';
$password = 'your_password';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

// api/pets.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->query("SELECT * FROM available_pets_view");
    $pets = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($pets);
}
?>
```

## 🔍 Testing the Database

### Test Queries

```sql
-- Check all tables
SHOW TABLES;

-- Count records in each table
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'pets', COUNT(*) FROM pets
UNION ALL
SELECT 'adoption_requests', COUNT(*) FROM adoption_requests;

-- Get available pets
SELECT pet_name, category, breed, age, location 
FROM available_pets_view 
ORDER BY created_at DESC;

-- Get pending adoption requests
SELECT ar.request_id, p.pet_name, u.full_name as adopter_name, ar.status
FROM adoption_requests ar
JOIN pets p ON ar.pet_id = p.pet_id
JOIN users u ON ar.adopter_id = u.user_id
WHERE ar.status = 'Pending';
```

### Test API Endpoints

```bash
# Test pets endpoint
curl http://localhost:3000/api/pets

# Test with filters
curl "http://localhost:3000/api/pets?category=Dog&available=true"
```

## 🔒 Security Best Practices

1. **Use Prepared Statements:**
   ```javascript
   const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
   db.query(query, [email, password], callback);
   ```

2. **Validate Input:**
   ```javascript
   function validatePetData(data) {
       if (!data.pet_name || data.pet_name.length < 2) {
           throw new Error('Pet name must be at least 2 characters');
       }
       if (!['Dog', 'Cat', 'Bird'].includes(data.category)) {
           throw new Error('Invalid pet category');
       }
   }
   ```

3. **Hash Passwords:**
   ```javascript
   const bcrypt = require('bcrypt');
   const hashedPassword = await bcrypt.hash(password, 10);
   ```

4. **Use Environment Variables:**
   ```env
   DB_HOST=localhost
   DB_USER=petcare_user
   DB_PASSWORD=your_secure_password
   DB_NAME=petcare_db
   ```

## 📈 Performance Optimization

### Indexes

The schema includes optimized indexes, but you can add more:

```sql
-- Add index for pet searches
CREATE INDEX idx_pets_search ON pets(category, is_available, created_at);

-- Add index for adoption requests
CREATE INDEX idx_adoption_requests_user ON adoption_requests(adopter_id, status);
```

### Query Optimization

```sql
-- Use EXPLAIN to analyze queries
EXPLAIN SELECT * FROM pets WHERE category = 'Dog' AND is_available = TRUE;

-- Use LIMIT for pagination
SELECT * FROM pets WHERE is_available = TRUE ORDER BY created_at DESC LIMIT 10 OFFSET 0;
```

## 🚨 Troubleshooting

### Common Issues

1. **Connection Refused:**
   - Check if MySQL service is running
   - Verify port 3306 is not blocked
   - Check firewall settings

2. **Access Denied:**
   - Verify username and password
   - Check user privileges: `SHOW GRANTS FOR 'petcare_user'@'localhost';`
   - Ensure database exists

3. **Table Already Exists:**
   ```sql
   DROP DATABASE IF EXISTS petcare_db;
   -- Then re-run the schema script
   ```

4. **Foreign Key Errors:**
   - Check if referenced records exist
   - Verify data types match
   - Check constraint definitions

### Debug Commands

```sql
-- Check MySQL status
SHOW PROCESSLIST;

-- Check database size
SELECT 
    table_schema AS 'Database',
    ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.tables
WHERE table_schema = 'petcare_db'
GROUP BY table_schema;

-- Check table structure
DESCRIBE pets;
SHOW CREATE TABLE pets;
```

## 📝 Maintenance

### Regular Backups

```bash
# Create backup
mysqldump -u root -p petcare_db > petcare_backup_$(date +%Y%m%d).sql

# Restore backup
mysql -u root -p petcare_db < petcare_backup_20241201.sql
```

### Monitor Performance

```sql
-- Check slow queries
SHOW VARIABLES LIKE 'slow_query_log';
SHOW VARIABLES LIKE 'long_query_time';

-- Analyze table statistics
ANALYZE TABLE pets, users, adoption_requests;
```

## 🎯 Next Steps

1. **Set up your backend API** using the provided examples
2. **Update the frontend** to use the database utility
3. **Test all functionality** with the sample data
4. **Implement authentication** and user management
5. **Add file upload** for pet images and documents
6. **Set up email notifications** for adoption requests
7. **Deploy to production** with proper security measures

## 📞 Support

If you encounter issues:

1. Check the MySQL error logs
2. Verify all configuration settings
3. Test with the provided sample queries
4. Check the troubleshooting section above
5. Review the database schema documentation

---

**Database Version**: 1.0.0  
**Last Updated**: December 2024  
**Compatible with**: MySQL 8.0+, Node.js 14+, PHP 7.4+
