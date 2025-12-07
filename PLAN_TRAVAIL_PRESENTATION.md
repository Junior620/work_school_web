# Gestionnaire de Stock
## Application Web Full-Stack sur AWS

---

## 🎯 Présentation

**Application web complète** de gestion d'inventaire avec authentification sécurisée

**URL:** http://gestionnaire-stock-env.eba-ggh33cr8.eu-west-1.elasticbeanstalk.com

**Objectifs:**
- Authentification sécurisée (JWT)
- Opérations CRUD complètes
- Déploiement cloud professionnel

---

## 🛠️ Technologies

### Frontend
- HTML5, CSS3, JavaScript
- Design responsive et moderne
- LocalStorage pour sessions

### Backend
- Node.js + Express.js
- bcryptjs (hachage mots de passe)
- jsonwebtoken (authentification JWT)
- PostgreSQL (base de données)

### Cloud AWS
- Elastic Beanstalk (hébergement)
- RDS PostgreSQL (base de données)
- VPC & Security Groups

---

## 📊 Architecture

```
Frontend (HTML/CSS/JS)
    ↓
Backend (Node.js/Express)
    ↓
Base de Données (PostgreSQL)
```

**Base de données:**
- Table `users` (id, email, password, fullname)
- Table `products` (id, name, category, price, quantity, user_id)
- Relation: 1 utilisateur → N produits

---

## 🔐 Authentification

**Inscription:**
1. Validation des données
2. Hachage du mot de passe (bcrypt)
3. Stockage en base de données
4. Redirection vers connexion

**Connexion:**
1. Vérification des identifiants
2. Génération token JWT (24h)
3. Stockage dans LocalStorage
4. Accès au tableau de bord

---

## 📦 CRUD - Produits

**CREATE** - `POST /api/products`
- Ajout de nouveaux produits

**READ** - `GET /api/products`
- Liste tous les produits de l'utilisateur

**UPDATE** - `PUT /api/products/:id`
- Modification des produits existants

**DELETE** - `DELETE /api/products/:id`
- Suppression de produits

**+ Fonctionnalités:** Recherche, Filtres, Statistiques

---

## 🚀 Déploiement AWS

### Étapes clés

**1. Préparation**
- Configuration Git/GitHub
- Fichiers: package.json, Procfile, .ebignore

**2. Configuration AWS**
- AWS CLI configuré (région: eu-west-1)
- Création VPC par défaut

**3. Base de données RDS**
- Instance PostgreSQL créée
- Import du schéma SQL
- Configuration Security Groups

**4. Elastic Beanstalk**
- Application initialisée
- Environnement créé (t2.micro)
- Variables d'environnement configurées

**5. Déploiement**
- `eb deploy`
- Application en ligne en 3 minutes

---

## 🐛 Problèmes Résolus

**502 Bad Gateway**
- Cause: bcrypt compilé sur Windows
- Solution: Exclusion node_modules, recompilation sur Linux

**Erreur CORS**
- Cause: URL localhost en production
- Solution: Détection automatique de l'environnement

**Connexion refusée**
- Cause: Serveur écoute sur localhost
- Solution: Écoute sur 0.0.0.0

---

## 📈 Résultats

**Infrastructure:**
- EC2 t2.micro (1 vCPU, 1GB RAM)
- RDS db.t3.micro (20GB)
- Région: eu-west-1 (Irlande)

**Performances:**
- Temps de réponse: < 200ms
- Disponibilité: 24/7
- Déploiement: 3 minutes

**Sécurité:**
- Mots de passe hachés (bcrypt)
- Authentification JWT
- Protection SQL injection
- HTTPS activé

---

## 💡 Compétences Acquises

**Technique:**
- Développement Full-Stack
- API REST
- Authentification JWT
- Base de données relationnelle
- Déploiement cloud AWS

**DevOps:**
- AWS CLI / EB CLI
- Git/GitHub
- Configuration infrastructure
- Résolution de bugs production

---

## 🔮 Évolutions Futures

- Notifications en temps réel
- Export de données (CSV, PDF)
- Gestion d'images produits
- Dashboard avec graphiques
- Tests automatisés
- CI/CD avec GitHub Actions

---

## ✅ Conclusion

**Projet réalisé avec succès:**
- ✅ Application fonctionnelle 24/7
- ✅ 8 endpoints API REST
- ✅ 2 tables avec relations
- ✅ ~1500 lignes de code
- ✅ Déploiement AWS professionnel

**Dépôt:** https://github.com/Junior620/work_school_web

---

*Projet réalisé par Junior - 2025*
