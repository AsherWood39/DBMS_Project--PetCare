# 🗄️ PetCare Database Setup Guide

This directory contains the MySQL database schema and setup files for the PetCare application.

## 📁 Files Overview

- `petcare_schema.sql` - Complete database schema with tables, views, procedures, and triggers
- `sample_data.sql` - Sample data for testing and development
- `README.md` - This setup guide

## 🚀 Quick Setup

### Prerequisites

- MySQL 8.0 or higher
- MySQL Workbench (recommended) or command line access
- Root or admin privileges to create databases

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

| Table | Purpose | Key Features |
|-------|---------|--------------|
| `users` | User accounts and profiles | Role-based access (Adopter/Owner/Admin) |
| `pets` | Pet listings and information | Category support (Dog/Cat/Bird) |
| `adoption_requests` | Adoption applications | Comprehensive form data |
| `adoptions` | Completed adoptions | Links requests to final adoption |
| `pet_health_records` | Pet health information | Medical history tracking |
| `vaccinations` | Vaccination records | Certificate file storage |

### Supporting Tables

| Table | Purpose |
|-------|---------|
| `messages` | User communication |
| `favorites` | User favorite pets |
| `system_settings` | App configuration |
| `audit_logs` | Action tracking |

## 🔧 Configuration

### Create Application User

```sql
-- Create dedicated user for the application
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

The schema includes optimized indexes for:
- User lookups by email and role
- Pet searches by category and availability
- Adoption request filtering by status
- Message queries by user and read status

### Views

Pre-built views for common queries:
- `available_pets_view` - Pets available for adoption with owner info
- `adoption_requests_view` - Adoption requests with pet and user details

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

1. **Password Hashing**: Use bcrypt or similar for password hashing
2. **SQL Injection**: Use prepared statements
3. **Access Control**: Implement proper role-based permissions
4. **Data Validation**: Validate all input data
5. **Backup Strategy**: Regular database backups

## 📊 Sample Data

The schema includes sample data for testing:
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
