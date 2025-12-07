# 🚀 Guide de Déploiement - Gestionnaire de Stock

Ce document détaille toutes les étapes nécessaires pour déployer l'application Gestionnaire de Stock sur AWS Elastic Beanstalk.

## 📋 Prérequis

- Compte AWS actif
- AWS CLI installé et configuré
- EB CLI (Elastic Beanstalk CLI) installé
- Git installé
- Node.js v18+ installé localement
- PostgreSQL installé (pour les tests locaux)

## 🔧 Étape 1 : Préparation du Projet

### 1.1 Configuration du package.json

Assurez-vous que votre `package.json` contient les scripts nécessaires :

```json
{
  "scripts": {
    "start": "node server.js"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### 1.2 Création du Procfile

Créez un fichier `Procfile` à la racine du projet :

```
web: node server.js
```

### 1.3 Configuration .ebignore

Créez un fichier `.ebignore` pour exclure les fichiers inutiles :

```
.git/
.env
node_modules/
*.log
.DS_Store
```

## 🗄️ Étape 2 : Configuration de la Base de Données AWS RDS

### 2.1 Création de l'instance RDS PostgreSQL

1. Connectez-vous à la console AWS
2. Accédez au service **RDS**
3. Cliquez sur **Create database**
4. Sélectionnez :
   - Engine : **PostgreSQL**
   - Version : **15.x** ou supérieure
   - Template : **Free tier** (pour les tests)
   - DB instance identifier : `gestionnaire-stock-db`
   - Master username : `postgres`
   - Master password : `Kidjamo2024!`
5. Configuration de l'instance :
   - DB instance class : `db.t3.micro`
   - Storage : 20 GB
   - Public access : **Yes** (pour la configuration initiale)
6. Cliquez sur **Create database**

### 2.2 Configuration des Groupes de Sécurité

1. Accédez à l'instance RDS créée
2. Cliquez sur le groupe de sécurité associé
3. Ajoutez une règle entrante :
   - Type : **PostgreSQL**
   - Port : **5432**
   - Source : **Anywhere-IPv4** (0.0.0.0/0) ou votre IP spécifique

### 2.3 Initialisation de la Base de Données

Connectez-vous à votre instance RDS et créez les tables :

```bash
# Récupérez l'endpoint RDS depuis la console AWS
# Exemple : gestionnaire-stock-db.xxxxx.eu-west-1.rds.amazonaws.com

# Connectez-vous via psql
psql -h gestionnaire-stock-db.xxxxx.eu-west-1.rds.amazonaws.com -U postgres -d postgres

# Exécutez le script SQL
\i database.sql

# Vérifiez les tables
\dt
```

## 🛠️ Étape 3 : Installation d'AWS EB CLI

### 3.1 Installation

```bash
# Via pip (Python)
pip install awsebcli --upgrade

# Vérification de l'installation
eb --version
```

### 3.2 Configuration des Credentials AWS

```bash
# Configurez AWS CLI si ce n'est pas déjà fait
aws configure

# Entrez vos informations :
# AWS Access Key ID: [Votre clé]
# AWS Secret Access Key: [Votre secret]
# Default region name: eu-west-1
# Default output format: json
```

## 🚀 Étape 4 : Initialisation d'Elastic Beanstalk

### 4.1 Initialisation du Projet

```bash
# Naviguez vers le répertoire du projet
cd techonologie_web

# Initialisez EB
eb init gestionnaire-stock --platform node.js --region eu-west-1
```

Répondez aux questions :
- Select a default region : **eu-west-1**
- Select an application to use : **Create new Application**
- Enter Application Name : **gestionnaire-stock**
- Select a platform : **Node.js**
- Select a platform branch : **Node.js 22**
- Do you want to set up SSH : **No** (ou Yes si vous voulez SSH)

### 4.2 Configuration des Extensions EB

Créez le dossier `.ebextensions/` et ajoutez les fichiers de configuration :

**`.ebextensions/01_environment.config`** :

```yaml
option_settings:
  aws:elasticbeanstalk:application:environment:
    NODE_ENV: production
```

**`.ebextensions/nodecommand.config`** :

```yaml
option_settings:
  aws:elasticbeanstalk:container:nodejs:
    NodeCommand: "node server.js"
```

## 🌐 Étape 5 : Création de l'Environnement

### 5.1 Création de l'Environnement

```bash
# Créez l'environnement avec une instance t2.micro
eb create gestionnaire-stock-env --single --instance-type t2.micro

# Attendez la fin de la création (5-10 minutes)
```

### 5.2 Configuration des Variables d'Environnement

```bash
# Configurez toutes les variables d'environnement
eb setenv DB_HOST=gestionnaire-stock-db.xxxxx.eu-west-1.rds.amazonaws.com
eb setenv DB_USER=postgres
eb setenv DB_PASSWORD=Kidjamo2024!
eb setenv DB_NAME=postgres
eb setenv DB_PORT=5432
eb setenv JWT_SECRET=votre_secret_jwt_super_securise_2024
eb setenv NODE_ENV=production
eb setenv PORT=8080
```

## 📦 Étape 6 : Déploiement de l'Application

### 6.1 Premier Déploiement

```bash
# Déployez l'application
eb deploy

# Attendez la fin du déploiement (2-5 minutes)
```

### 6.2 Vérification du Déploiement

```bash
# Vérifiez le statut
eb status

# Consultez les logs
eb logs

# Ouvrez l'application dans le navigateur
eb open
```

## ✅ Étape 7 : Tests et Validation

### 7.1 Test de Santé du Serveur

```bash
curl http://gestionnaire-stock-env.eba-ggh33cr8.eu-west-1.elasticbeanstalk.com/api/health
```

### 7.2 Test d'Inscription

```bash
curl -X POST http://gestionnaire-stock-env.eba-ggh33cr8.eu-west-1.elasticbeanstalk.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","name":"Test User"}'
```

### 7.3 Test de Connexion

```bash
curl -X POST http://gestionnaire-stock-env.eba-ggh33cr8.eu-west-1.elasticbeanstalk.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'
```

### 7.4 Test de Création de Produit

```bash
# Remplacez YOUR_TOKEN par le token obtenu lors de la connexion
curl -X POST http://gestionnaire-stock-env.eba-ggh33cr8.eu-west-1.elasticbeanstalk.com/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"MacBook Pro","description":"Laptop haute performance","price":2499.99,"quantity":5}'
```

## 🔄 Étape 8 : Mises à Jour et Maintenance

### 8.1 Déployer des Modifications

```bash
# Après avoir modifié le code
git add .
git commit -m "Description des modifications"

# Déployez les changements
eb deploy
```

### 8.2 Consulter les Logs

```bash
# Logs en temps réel
eb logs --stream

# Derniers logs
eb logs
```

### 8.3 Redémarrer l'Application

```bash
eb restart
```

## 🛡️ Étape 9 : Sécurisation

### 9.1 Configuration HTTPS

1. Accédez à la console Elastic Beanstalk
2. Sélectionnez votre environnement
3. Configuration → Load balancer
4. Ajoutez un listener HTTPS avec un certificat SSL/TLS

### 9.2 Restriction d'Accès à RDS

1. Modifiez le groupe de sécurité RDS
2. Limitez l'accès uniquement au groupe de sécurité d'Elastic Beanstalk
3. Supprimez la règle "Anywhere"

## 📊 Étape 10 : Monitoring

### 10.1 CloudWatch

- Accédez à CloudWatch depuis la console AWS
- Surveillez les métriques : CPU, mémoire, requêtes
- Configurez des alarmes si nécessaire

### 10.2 Health Monitoring

```bash
# Vérifiez la santé de l'environnement
eb health

# Détails complets
eb health --refresh
```

## 🗑️ Nettoyage (Optionnel)

### Supprimer l'Environnement

```bash
# Terminer l'environnement
eb terminate gestionnaire-stock-env

# Supprimer l'application
aws elasticbeanstalk delete-application --application-name gestionnaire-stock
```

### Supprimer la Base de Données RDS

1. Console AWS → RDS
2. Sélectionnez l'instance
3. Actions → Delete
4. Décochez "Create final snapshot" (pour les tests)
5. Confirmez la suppression

## 🐛 Dépannage

### Problème : Déploiement échoue

```bash
# Consultez les logs détaillés
eb logs

# Vérifiez la configuration
eb config
```

### Problème : Erreur de connexion à la base de données

- Vérifiez les variables d'environnement : `eb printenv`
- Vérifiez les groupes de sécurité RDS
- Testez la connexion depuis votre machine locale

### Problème : Application ne démarre pas

- Vérifiez que `package.json` contient le script "start"
- Vérifiez le `Procfile`
- Consultez les logs : `eb logs`

## 📝 Commandes Utiles

```bash
# Lister les environnements
eb list

# Afficher la configuration
eb config

# Afficher les variables d'environnement
eb printenv

# SSH dans l'instance (si configuré)
eb ssh

# Ouvrir la console EB
eb console

# Mettre à l'échelle
eb scale 2
```

## 🎯 Résultat Final

Votre application est maintenant déployée et accessible à l'adresse :

**http://gestionnaire-stock-env.eba-ggh33cr8.eu-west-1.elasticbeanstalk.com**

## 📚 Ressources Supplémentaires

- [Documentation AWS Elastic Beanstalk](https://docs.aws.amazon.com/elasticbeanstalk/)
- [Documentation AWS RDS](https://docs.aws.amazon.com/rds/)
- [EB CLI Documentation](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3.html)
- [Node.js sur Elastic Beanstalk](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create_deploy_nodejs.html)

---

**✅ Déploiement réussi !** Votre application de gestion de stock est maintenant en production sur AWS.
