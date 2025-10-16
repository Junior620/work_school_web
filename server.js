const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Servir les fichiers statiques

// Middleware d'authentification
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token non fourni' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token invalide' });
        }
        req.user = user;
        next();
    });
};

// ============================================
// ROUTES D'AUTHENTIFICATION
// ============================================

// Inscription
app.post('/api/register', async (req, res) => {
    try {
        const { fullname, email, password } = req.body;

        // Vérifier si l'email existe déjà
        const userExists = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: 'Cet email est déjà utilisé' });
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insérer l'utilisateur
        const result = await pool.query(
            'INSERT INTO users (fullname, email, password) VALUES ($1, $2, $3) RETURNING id, fullname, email, created_at',
            [fullname, email, hashedPassword]
        );

        res.status(201).json({
            message: 'Utilisateur créé avec succès',
            user: result.rows[0]
        });
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Connexion
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Récupérer l'utilisateur
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }

        const user = result.rows[0];

        // Vérifier le mot de passe
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }

        // Créer le token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Connexion réussie',
            token,
            user: {
                id: user.id,
                fullname: user.fullname,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// ============================================
// ROUTES CRUD PRODUITS
// ============================================

// GET - Récupérer tous les produits de l'utilisateur
app.get('/api/products', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM products WHERE user_id = $1 ORDER BY created_at DESC',
            [req.user.id]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des produits:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// GET - Récupérer un produit spécifique
app.get('/api/products/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'SELECT * FROM products WHERE id = $1 AND user_id = $2',
            [id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Erreur lors de la récupération du produit:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// POST - Créer un nouveau produit
app.post('/api/products', authenticateToken, async (req, res) => {
    try {
        const { name, category, price, quantity, description } = req.body;

        const result = await pool.query(
            'INSERT INTO products (name, category, price, quantity, description, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [name, category, price, quantity, description || '', req.user.id]
        );

        res.status(201).json({
            message: 'Produit créé avec succès',
            product: result.rows[0]
        });
    } catch (error) {
        console.error('Erreur lors de la création du produit:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// PUT - Mettre à jour un produit
app.put('/api/products/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, category, price, quantity, description } = req.body;

        const result = await pool.query(
            'UPDATE products SET name = $1, category = $2, price = $3, quantity = $4, description = $5 WHERE id = $6 AND user_id = $7 RETURNING *',
            [name, category, price, quantity, description, id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }

        res.json({
            message: 'Produit mis à jour avec succès',
            product: result.rows[0]
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du produit:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// DELETE - Supprimer un produit
app.delete('/api/products/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'DELETE FROM products WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }

        res.json({ message: 'Produit supprimé avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression du produit:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// GET - Statistiques
app.get('/api/statistics', authenticateToken, async (req, res) => {
    try {
        const stats = await pool.query(
            `SELECT 
                COUNT(*) as total_products,
                SUM(price * quantity) as total_value,
                COUNT(*) FILTER (WHERE quantity < 10) as low_stock,
                COUNT(*) FILTER (WHERE quantity >= 10) as in_stock
            FROM products 
            WHERE user_id = $1`,
            [req.user.id]
        );

        res.json(stats.rows[0]);
    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Route de test
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Serveur en ligne' });
});

// Route racine pour tester que le serveur fonctionne
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Gestionnaire de Stock</title>
        </head>
        <body>
            <h1>🚀 Serveur opérationnel !</h1>
            <p>Port: ${PORT}</p>
            <p>Environnement: ${process.env.NODE_ENV || 'development'}</p>
            <p><a href="/api/health">Test API Health</a></p>
        </body>
        </html>
    `);
});

// Démarrer le serveur sur 0.0.0.0 pour permettre à Nginx de se connecter
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    console.log(`📊 Base de données: ${process.env.DB_NAME || 'non configurée'}`);
    console.log(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`);
});
