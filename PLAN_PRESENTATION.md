# Gestionnaire de Stock - Plan de Travail

## 🛠️ Technologies Utilisées

### Backend
- **Node.js** + Express.js
- **PostgreSQL** (Base de données)
- **bcrypt** (Hashing des mots de passe)
- **JWT** (Authentification)
- **Azure App Service** (Hébergement)

### Frontend
- **HTML5, CSS3, JavaScript**
- **Vercel** (Hébergement)

## 📊 Fonctionnalités CRUD

### Authentification
- **Inscription** : Création de compte utilisateur
- **Connexion** : Authentification avec JWT

### Gestion des Produits
- **Create** : Ajouter un nouveau produit
- **Read** : Afficher la liste des produits
- **Update** : Modifier un produit existant
- **Delete** : Supprimer un produit

## 🚀 Étapes de Déploiement

### 1. Backend sur Azure
1. Créer une base PostgreSQL Azure
2. Initialiser le schéma de base de données
3. Créer un App Service
4. Configurer les variables d'environnement
5. Déployer le code

### 2. Frontend sur Vercel
1. Configurer l'URL de l'API Azure
2. Créer le fichier vercel.json
3. Déployer via Vercel CLI ou GitHub

### 3. Configuration Finale
- Configurer CORS
- Tester l'application
- Vérifier la sécurité

