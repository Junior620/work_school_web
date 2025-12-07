const { Pool } = require('pg');
require('dotenv').config();

// Configuration de la connexion PostgreSQL
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432,
    // Forcer SSL si c'est une connexion Azure (contient .azure.com) ou en production
    ssl: (process.env.DB_HOST && process.env.DB_HOST.includes('.azure.com')) || process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false,
    connectionTimeoutMillis: 5000,
});

// Tester la connexion
pool.on('connect', () => {
    console.log('✅ Connecté à la base de données PostgreSQL');
});

pool.on('error', (err) => {
    console.error('❌ Erreur de connexion à la base de données:', err);
    // Ne pas arrêter le serveur, juste logger l'erreur
});

// Test de connexion au démarrage
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ Erreur lors du test de connexion:', err.message);
    } else {
        console.log('✅ Test de connexion réussi:', res.rows[0].now);
    }
});

module.exports = pool;
