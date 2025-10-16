const { Pool } = require('pg');
require('dotenv').config();

// Configuration de la connexion PostgreSQL
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432,
});

// Tester la connexion
pool.on('connect', () => {
    console.log('✅ Connecté à la base de données PostgreSQL');
});

pool.on('error', (err) => {
    console.error('❌ Erreur de connexion à la base de données:', err);
    process.exit(-1);
});

module.exports = pool;

