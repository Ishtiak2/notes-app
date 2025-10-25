const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'notes_app',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // SSL configuration for Aiven and other cloud databases
    ssl: process.env.DB_SSL === 'true' || process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false // Required for Aiven's self-signed certificates
    } : false
});

// Convert pool to use promises
const promisePool = pool.promise();

module.exports = promisePool;
