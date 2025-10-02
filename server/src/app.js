import mysql from 'mysql2/promise';

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'A1835Thira@2025',
  database: 'petcare_db'
});

export default db;
