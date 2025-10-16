# 📦 Gestionnaire de Stock - Application Web

Une application web moderne et minimaliste pour gérer efficacement votre inventaire de produits avec un système complet d'authentification et de gestion CRUD.

## 🌟 Aperçu

Cette application permet de gérer un inventaire de produits avec des fonctionnalités complètes de création, lecture, mise à jour et suppression (CRUD). Elle intègre un système d'authentification sécurisé avec inscription et connexion des utilisateurs.

**🔗 Application déployée :** [http://gestionnaire-stock-env.eba-ggh33cr8.eu-west-1.elasticbeanstalk.com](http://gestionnaire-stock-env.eba-ggh33cr8.eu-west-1.elasticbeanstalk.com)

## ✨ Fonctionnalités

### 🔐 Authentification
- **Inscription** : Création de nouveaux comptes utilisateurs avec validation des données
- **Connexion** : Authentification sécurisée avec JWT (JSON Web Tokens)
- **Session persistante** : Maintien de la connexion utilisateur
- **Déconnexion** : Fermeture sécurisée de session

### 📊 Gestion des Produits
- **Ajout de produits** : Formulaire intuitif pour créer de nouveaux produits
- **Liste des produits** : Affichage de tous les produits en temps réel
- **Modification** : Mise à jour des informations produit
- **Suppression** : Retrait de produits de l'inventaire
- **Recherche** : Filtre rapide par nom de produit
- **Validation** : Vérification des données avant soumission

### 🎨 Interface Utilisateur
- Design **minimaliste** et **épuré**
- Interface **responsive** (mobile, tablette, desktop)
- Animations fluides et transitions élégantes
- Feedback visuel pour chaque action
- Messages d'erreur et de succès clairs

## 🛠️ Technologies Utilisées

### Backend
- **Node.js** (v18+) - Environnement d'exécution JavaScript
- **Express.js** (v4.21.2) - Framework web
- **PostgreSQL** - Base de données relationnelle
- **bcryptjs** (v2.4.3) - Hachage sécurisé des mots de passe
- **jsonwebtoken** (v9.0.2) - Gestion des tokens JWT
- **pg** (v8.13.1) - Client PostgreSQL pour Node.js
- **cors** (v2.8.5) - Gestion des requêtes cross-origin
- **dotenv** (v16.4.7) - Gestion des variables d'environnement

### Frontend
- **HTML5** - Structure sémantique
- **CSS3** - Styles modernes avec animations
- **JavaScript Vanilla** - Pas de framework, code léger et performant
- **Fetch API** - Communication avec le backend

### Infrastructure
- **AWS Elastic Beanstalk** - Hébergement et déploiement automatisé
- **AWS RDS PostgreSQL** - Base de données managée
- **Git & GitHub** - Contrôle de version

## 📁 Structure du Projet

```
gestionnaire-stock/
├── 📄 server.js              # Serveur Express principal
├── 📄 db.js                  # Configuration de la base de données
├── 📄 database.sql           # Schéma et migrations SQL
├── 📄 package.json           # Dépendances et scripts NPM
├── 📄 Procfile               # Configuration pour déploiement
├── 📄 .env                   # Variables d'environnement (non versionné)
│
├── 🎨 Frontend
│   ├── index.html            # Page principale (gestion des produits)
│   ├── login.html            # Page de connexion
│   ├── register.html         # Page d'inscription
│   │
│   └── asset/
│       ├── index.css         # Styles de la page principale
│       ├── auth.css          # Styles d'authentification
│       ├── index.js          # Logique de gestion des produits
│       ├── login.js          # Logique de connexion
│       └── register.js       # Logique d'inscription
│
├── ⚙️ Configuration AWS
│   ├── .ebextensions/        # Configuration Elastic Beanstalk
│   │   ├── 01_environment.config
│   │   └── nodecommand.config
│   ├── .ebignore             # Fichiers à ignorer lors du déploiement
│   ├── amplify.yml           # Configuration AWS Amplify
│   ├── Dockerrun.aws.json    # Configuration Docker AWS
│   └── DEPLOYMENT.md         # Guide de déploiement détaillé
│
└── 📚 Documentation
    └── README.md             # Ce fichier
```

## 🚀 Installation et Configuration

### Prérequis

- **Node.js** v18 ou supérieur
- **PostgreSQL** v15 ou supérieur
- **npm** ou **yarn**
- Compte **AWS** (pour le déploiement)

### 1. Cloner le projet

```bash
git clone https://github.com/Junior620/work_school_web.git
cd work_school_web
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration de la base de données

#### Option A : PostgreSQL local

```bash
# Se connecter à PostgreSQL
psql -U postgres

# Créer la base de données
CREATE DATABASE school;

# Se déconnecter et importer le schéma
\q
psql -U postgres -d school -f database.sql
```

#### Option B : AWS RDS (Production)

La base de données RDS est automatiquement configurée lors du déploiement. Les informations de connexion sont gérées via les variables d'environnement.

### 4. Configuration des variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
# Configuration Base de données
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe
DB_NAME=school
DB_PORT=5432

# Configuration JWT
JWT_SECRET=votre_secret_jwt_super_securise_2024

# Configuration Serveur
PORT=3000
NODE_ENV=development
```

**⚠️ Important :** Ne jamais commiter le fichier `.env` dans Git !

### 5. Lancer l'application

```bash
# Mode développement
npm start

# L'application sera accessible sur http://localhost:3000
```

## 🔧 API Endpoints

### Authentification

| Méthode | Endpoint | Description | Corps de la requête |
|---------|----------|-------------|---------------------|
| `POST` | `/api/auth/register` | Créer un compte | `{ email, password, name }` |
| `POST` | `/api/auth/login` | Se connecter | `{ email, password }` |
| `POST` | `/api/auth/logout` | Se déconnecter | - |
| `GET` | `/api/auth/me` | Profil utilisateur | Token JWT requis |

### Produits

| Méthode | Endpoint | Description | Corps de la requête |
|---------|----------|-------------|---------------------|
| `GET` | `/api/products` | Liste tous les produits | - |
| `GET` | `/api/products/:id` | Détails d'un produit | - |
| `POST` | `/api/products` | Créer un produit | `{ name, description, price, quantity }` |
| `PUT` | `/api/products/:id` | Modifier un produit | `{ name, description, price, quantity }` |
| `DELETE` | `/api/products/:id` | Supprimer un produit | - |

**🔒 Note :** Tous les endpoints `/api/products` nécessitent une authentification JWT.

## 📊 Schéma de Base de Données

### Table `users`

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Table `products`

```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🌐 Déploiement sur AWS

### Déploiement rapide

L'application est déjà configurée pour le déploiement sur AWS Elastic Beanstalk.

```bash
# 1. Initialiser EB CLI
eb init gestionnaire-stock --platform node.js --region eu-west-1

# 2. Créer l'environnement
eb create gestionnaire-stock-env --single --instance-type t2.micro

# 3. Configurer les variables d'environnement
eb setenv DB_HOST=your-rds-endpoint.rds.amazonaws.com
eb setenv DB_USER=postgres
eb setenv DB_PASSWORD=Kidjamo2024!
eb setenv DB_NAME=postgres
eb setenv JWT_SECRET=votre_secret_jwt

# 4. Déployer
eb deploy

# 5. Ouvrir l'application
eb open
```

**📖 Documentation complète :** Consultez [DEPLOYMENT.md](./DEPLOYMENT.md) pour un guide détaillé.

## 🧪 Tests

### Test des endpoints API

```bash
# Test de santé du serveur
curl http://localhost:3000/api/health

# Test d'inscription
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","name":"Test User"}'

# Test de connexion
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'

# Test de création de produit (avec token)
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"name":"MacBook Pro","description":"Laptop haute performance","price":2499.99,"quantity":5}'
```

## 🎨 Captures d'écran

### Page de connexion
Interface minimaliste et intuitive pour l'authentification des utilisateurs.

### Dashboard des produits
Vue d'ensemble de l'inventaire avec options de recherche et de filtrage.

### Formulaire d'ajout/modification
Interface claire pour la gestion des produits.

## 🔒 Sécurité

- **Mots de passe hachés** avec bcrypt (10 rounds de salage)
- **Tokens JWT** pour l'authentification stateless
- **Validation des entrées** côté client et serveur
- **Protection CORS** configurée
- **Variables d'environnement** pour les secrets
- **Requêtes préparées** pour prévenir les injections SQL
- **Sanitisation des données** avant insertion en base

## 🐛 Dépannage

### Problème : Erreur de connexion à la base de données

```bash
# Vérifier que PostgreSQL est en cours d'exécution
sudo systemctl status postgresql

# Vérifier les credentials dans le fichier .env
cat .env
```

### Problème : Port 3000 déjà utilisé

```bash
# Trouver le processus utilisant le port
netstat -ano | findstr :3000

# Changer le port dans .env
PORT=3001
```

### Problème : Token JWT invalide

- Vérifiez que `JWT_SECRET` est identique entre le client et le serveur
- Assurez-vous que le token n'a pas expiré (durée : 24h)
- Essayez de vous reconnecter

## 🤝 Contribution

Les contributions sont les bienvenues ! Voici comment vous pouvez aider :

1. **Fork** le projet
2. Créez une **branche** pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. **Committez** vos changements (`git commit -m 'Add some AmazingFeature'`)
4. **Push** vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une **Pull Request**



