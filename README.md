# 📦 Gestionnaire de Stock

> Une application web moderne de gestion de stock avec authentification sécurisée et interface intuitive.

## 🎯 À propos du projet

J'ai développé cette application dans le cadre de mon apprentissage des technologies web. C'est un gestionnaire de stock complet qui permet aux utilisateurs de gérer leur inventaire de produits de manière simple et efficace.

L'application utilise une architecture client-serveur avec une base de données PostgreSQL pour stocker les données de manière persistante et sécurisée.

## ✨ Fonctionnalités principales

### 🔐 Authentification
- Inscription des nouveaux utilisateurs
- Connexion sécurisée avec JWT
- Protection des mots de passe avec bcrypt
- Session utilisateur persistante

### 📊 Gestion des produits (CRUD complet)
- **Créer** : Ajouter de nouveaux produits avec nom, catégorie, prix, quantité et description
- **Lire** : Afficher tous les produits dans un tableau interactif
- **Modifier** : Mettre à jour les informations des produits existants
- **Supprimer** : Retirer des produits de l'inventaire

### 🔍 Fonctionnalités avancées
- Recherche en temps réel dans l'inventaire
- Filtrage par catégorie
- Statistiques en temps réel :
  - Nombre total de produits
  - Valeur totale du stock
  - Produits en stock faible (< 10 unités)
  - Produits en stock suffisant
- Interface responsive (mobile-friendly)

## 🛠️ Technologies utilisées

### Frontend
- **HTML5** - Structure des pages
- **CSS3** - Design moderne et minimaliste
- **JavaScript Vanilla** - Logique côté client, appels API

### Backend
- **Node.js** - Environnement d'exécution
- **Express.js** - Framework web
- **PostgreSQL** - Base de données relationnelle
- **bcrypt** - Hachage des mots de passe
- **jsonwebtoken** - Authentification JWT
- **dotenv** - Gestion des variables d'environnement
- **cors** - Gestion des requêtes cross-origin

## 📁 Structure du projet

```
techonologie_web/
├── asset/
│   ├── auth.css          # Styles pour login/register
│   ├── index.css         # Styles pour le dashboard
│   ├── login.js          # Logique de connexion
│   ├── register.js       # Logique d'inscription
│   └── index.js          # Logique CRUD produits
├── index.html            # Page principale (dashboard)
├── login.html            # Page de connexion
├── register.html         # Page d'inscription
├── server.js             # Serveur Express + API REST
├── db.js                 # Configuration PostgreSQL
├── database.sql          # Script de création des tables
├── .env                  # Variables d'environnement
├── package.json          # Dépendances Node.js
└── README.md            # Ce fichier
```

## 🚀 Installation et démarrage

### Prérequis

Assurez-vous d'avoir installé sur votre machine :
- [Node.js](https://nodejs.org/) (v14 ou supérieur)
- [PostgreSQL](https://www.postgresql.org/) (v12 ou supérieur)
- Un navigateur web moderne

### Étape 1 : Cloner le projet

```bash
git clone https://github.com/Junior620/work_school_web.git
cd work_school_web
```

### Étape 2 : Installer les dépendances

```bash
npm install
```

### Étape 3 : Configuration de la base de données

1. Créez une base de données PostgreSQL (ou utilisez une existante)
2. Créez un fichier `.env` à la racine du projet :

```env
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe
DB_NAME=school
DB_PORT=5432

JWT_SECRET=votre_secret_jwt_super_securise
PORT=3000
```

3. Exécutez le script SQL pour créer les tables :

```bash
psql -U postgres -d school -f database.sql
```

Ou via pgAdmin : copiez le contenu de `database.sql` et exécutez-le dans l'outil de requête.

### Étape 4 : Démarrer le serveur

```bash
npm start
```

Le serveur démarre sur `http://localhost:3000`

### Étape 5 : Utiliser l'application

Ouvrez votre navigateur et allez sur :
```
http://localhost:3000/login.html
```

## 📖 Guide d'utilisation

### Première utilisation

1. **Créer un compte**
   - Cliquez sur "Inscrivez-vous"
   - Remplissez le formulaire avec vos informations
   - Le mot de passe doit contenir au moins 6 caractères

2. **Se connecter**
   - Utilisez vos identifiants pour vous connecter
   - Vous serez redirigé vers le tableau de bord

3. **Gérer vos produits**
   - Ajoutez vos premiers produits via le formulaire
   - Modifiez ou supprimez-les avec les boutons d'action
   - Utilisez la barre de recherche pour trouver rapidement un produit
   - Filtrez par catégorie pour une meilleure organisation

## 🗄️ Architecture de la base de données

### Table `users`
```sql
id          SERIAL PRIMARY KEY
fullname    VARCHAR(255)
email       VARCHAR(255) UNIQUE
password    VARCHAR(255)  -- hashé avec bcrypt
created_at  TIMESTAMP
updated_at  TIMESTAMP
```

### Table `products`
```sql
id          SERIAL PRIMARY KEY
name        VARCHAR(255)
category    VARCHAR(100)
price       DECIMAL(10, 2)
quantity    INTEGER
description TEXT
user_id     INTEGER (FK -> users)
created_at  TIMESTAMP
updated_at  TIMESTAMP
```

## 🔒 Sécurité

J'ai mis en place plusieurs mesures de sécurité :
- Les mots de passe sont hashés avec bcrypt (10 rounds)
- Authentification par JWT avec expiration (24h)
- Protection contre les injections SQL (requêtes paramétrées)
- Validation des données côté serveur
- Chaque utilisateur accède uniquement à ses propres données
- Protection CORS configurée

## 🎨 Design

L'interface utilise un design minimaliste et moderne avec :
- Palette de couleurs violet/bleu
- Animations fluides et naturelles
- Interface responsive (mobile, tablette, desktop)
- Notifications toast pour les retours utilisateur
- Badges de statut pour les niveaux de stock

## 📡 API Endpoints

### Authentification
- `POST /api/register` - Créer un nouveau compte
- `POST /api/login` - Se connecter

### Produits (authentification requise)
- `GET /api/products` - Liste des produits
- `GET /api/products/:id` - Détails d'un produit
- `POST /api/products` - Créer un produit
- `PUT /api/products/:id` - Modifier un produit
- `DELETE /api/products/:id` - Supprimer un produit
- `GET /api/statistics` - Statistiques du stock

### Santé
- `GET /api/health` - Vérifier l'état du serveur

## 🐛 Problèmes connus

Aucun pour le moment. Si vous rencontrez un bug, n'hésitez pas à ouvrir une issue sur GitHub.

## 📝 Scripts npm

```bash
npm start        # Démarre le serveur en mode production
npm run dev      # Démarre le serveur en mode développement (avec nodemon)
```

## 🤝 Contribution

Les contributions sont les bienvenues ! Si vous souhaitez améliorer le projet :

1. Forkez le projet
2. Créez une branche (`git checkout -b feature/amelioration`)
3. Committez vos changements (`git commit -m 'Ajout d'une fonctionnalité'`)
4. Pushez vers la branche (`git push origin feature/amelioration`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Vous êtes libre de l'utiliser, le modifier et le distribuer.

## 👨‍💻 Auteur

**Junior620**
- GitHub: [@Junior620](https://github.com/Junior620)
- Projet: [work_school_web](https://github.com/Junior620/work_school_web)


---

💡 **Astuce** : N'oubliez pas de changer le `JWT_SECRET` dans le fichier `.env` en production !

⭐ Si ce projet vous a été utile, n'hésitez pas à lui donner une étoile sur GitHub !

