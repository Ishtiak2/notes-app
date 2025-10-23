const mysql = require('mysql2');
require('dotenv').config();

// Support both direct connection and connection string
const dbConfig = process.env.DATABASE_URL 
    ? {
        // For Railway/Render connection string
        uri: process.env.DATABASE_URL,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      }
    : {
        // For traditional MySQL config
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'notes_app',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      };

const pool = mysql.createPool(dbConfig);

// Test database connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection failed:', err.message);
    } else {
        console.log('Database connected successfully');
        connection.release();
    }
});

// Convert pool to use promises
const promisePool = pool.promise();

module.exports = promisePool;
