# 🚀 Guide de Déploiement - Gestionnaire de Stock

## 📋 Prérequis

- Compte Azure (pour le backend)
- Compte Vercel (pour le frontend)
- Compte GitHub
- Azure CLI installé
- Vercel CLI installé

## 🔧 Configuration du Backend sur Azure

### 1. Créer une base de données PostgreSQL sur Azure

```bash
# Se connecter à Azure
az login

# Créer un groupe de ressources
az group create --name gestionnaire-stock-rg --location westeurope

# Créer un serveur PostgreSQL
az postgres flexible-server create \
  --resource-group gestionnaire-stock-rg \
  --name gestionnaire-stock-db \
  --location westeurope \
  --admin-user adminuser \
  --admin-password "VotreMotDePasse123!" \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --storage-size 32

# Créer la base de données
az postgres flexible-server db create \
  --resource-group gestionnaire-stock-rg \
  --server-name gestionnaire-stock-db \
  --database-name school

# Configurer le pare-feu (autoriser les connexions Azure)
az postgres flexible-server firewall-rule create \
  --resource-group gestionnaire-stock-rg \
  --name gestionnaire-stock-db \
  --rule-name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

### 2. Initialiser la base de données

```bash
# Se connecter à la base de données
psql "host=gestionnaire-stock-db.postgres.database.azure.com port=5432 dbname=school user=adminuser password=VotreMotDePasse123! sslmode=require"

# Exécuter le script database.sql
\i database.sql
```

### 3. Déployer le Backend sur Azure App Service

```bash
# Créer un App Service Plan
az appservice plan create \
  --name gestionnaire-stock-plan \
  --resource-group gestionnaire-stock-rg \
  --sku B1 \
  --is-linux

# Créer la Web App
az webapp create \
  --resource-group gestionnaire-stock-rg \
  --plan gestionnaire-stock-plan \
  --name gestionnaire-stock-api \
  --runtime "NODE:18-lts"

# Configurer les variables d'environnement
az webapp config appsettings set \
  --resource-group gestionnaire-stock-rg \
  --name gestionnaire-stock-api \
  --settings \
    DB_HOST="gestionnaire-stock-db.postgres.database.azure.com" \
    DB_USER="adminuser" \
    DB_PASSWORD="VotreMotDePasse123!" \
    DB_NAME="school" \
    DB_PORT="5432" \
    JWT_SECRET="votre_secret_jwt_super_securise" \
    PORT="8080"

# Déployer le code
az webapp up \
  --resource-group gestionnaire-stock-rg \
  --name gestionnaire-stock-api \
  --runtime "NODE:18-lts"
```

### 4. Configuration CORS sur Azure

```bash
# Activer CORS
az webapp cors add \
  --resource-group gestionnaire-stock-rg \
  --name gestionnaire-stock-api \
  --allowed-origins "*"
```

## 🌐 Configuration du Frontend sur Vercel

### 1. Préparer le Frontend

Créer un fichier `config.js` dans le dossier `asset/`:

```javascript
// Configuration de l'API
const API_URL = 'https://gestionnaire-stock-api.azurewebsites.net/api';
```

Mettre à jour `asset/index.js`, `asset/login.js`, et `asset/register.js` pour utiliser cette configuration.

### 2. Déployer sur Vercel

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter à Vercel
vercel login

# Déployer
vercel --prod
```

Ou depuis l'interface Vercel:
1. Aller sur https://vercel.com
2. Importer le projet depuis GitHub
3. Configurer le projet (automatique avec vercel.json)
4. Déployer

### 3. Configuration des Variables d'Environnement sur Vercel

Dans le dashboard Vercel:
- Ajouter `NEXT_PUBLIC_API_URL` = `https://gestionnaire-stock-api.azurewebsites.net/api`

## ✅ Vérification

1. **Backend**: Accéder à `https://gestionnaire-stock-api.azurewebsites.net/api/health`
2. **Frontend**: Accéder à `https://votre-app.vercel.app`

## 🔒 Sécurité

- Modifier le JWT_SECRET en production
- Configurer SSL/TLS
- Limiter les origines CORS en production
- Activer les backups automatiques de la base de données

## 📝 Notes

- Les URLs peuvent varier selon vos choix de noms
- Assurez-vous que le pare-feu Azure autorise Vercel
- Les logs sont accessibles via Azure Portal et Vercel Dashboard

