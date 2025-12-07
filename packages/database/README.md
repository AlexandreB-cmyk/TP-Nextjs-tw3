# @workspace/database

Package de base de données MongoDB pour le projet TP-Nextjs.

## Description

Ce package fournit un client MongoDB (version 6.12.0) et des modèles pour gérer les données de l'application. Il est conçu pour introduire les concepts de base de données et l'authentification web complète.

Le package utilise le driver MongoDB officiel avec un pattern singleton pour optimiser la gestion des connexions et assurer des performances optimales en développement comme en production.

## Prérequis

- Docker et Docker Compose installés
- Node.js 20+
- pnpm

## Démarrage rapide

### 1. Lancer MongoDB avec Docker

Depuis la racine du projet :

```bash
docker compose up -d
```

Cela démarre une instance MongoDB accessible sur `mongodb://localhost:27017`.

### 2. Vérifier que MongoDB est en cours d'exécution

```bash
docker compose ps
```

### 3. Utiliser le package dans votre code

```typescript
import { 
  getDatabase, 
  checkConnection,
  createUser,
  findUserByEmail,
  initializeUsersCollection 
} from '@workspace/database';

// Vérifier la connexion
const isConnected = await checkConnection();
console.log('MongoDB connecté:', isConnected);

// Initialiser les index (à faire une fois au démarrage)
await initializeUsersCollection();

// Créer un utilisateur
const user = await createUser({
  email: 'test@example.com',
  name: 'Test User',
  password: 'hashed_password', // À hasher avec bcrypt en production
});

// Trouver un utilisateur par email
const foundUser = await findUserByEmail('test@example.com');
```

## Configuration

Le package utilise des variables d'environnement pour la configuration. Ces variables doivent être définies dans le fichier `.env.local` de votre application web.

| Variable | Description | Défaut | Requis |
|----------|-------------|--------|--------|
| `MONGODB_URI` | URL de connexion MongoDB | `mongodb://localhost:27017` | Non |
| `MONGODB_DB_NAME` | Nom de la base de données | `tp-nextjs` | Non |

### Exemple de fichier `.env.local`

Créez ce fichier à la racine de votre application web (`apps/web/.env.local`) :

```env
# Configuration MongoDB
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=tp-nextjs
```

### Caractéristiques techniques

- **Driver MongoDB officiel** : version 6.12.0
- **Pattern Singleton** : une seule connexion réutilisée dans toute l'application
- **Connection pooling** : pool de 2-10 connexions pour optimiser les performances
- **Timeouts configurés** :
  - `serverSelectionTimeoutMS`: 5000ms
  - `connectTimeoutMS`: 10000ms
- **Support TypeScript complet** avec types génériques pour les collections

## Commandes Docker utiles

```bash
# Démarrer MongoDB
docker compose up -d

# Arrêter MongoDB
docker compose down

# Voir les logs
docker compose logs -f mongodb

# Accéder au shell MongoDB
docker exec -it tp-nextjs-mongodb mongosh
```

## API

### Client MongoDB

- `getMongoClient()` - Récupère le client MongoDB
- `getDatabase()` - Récupère la base de données principale
- `getCollection<T>(name)` - Récupère une collection typée
- `closeConnection()` - Ferme la connexion
- `checkConnection()` - Vérifie la connexion

### Modèle User

- `createUser(input)` - Crée un utilisateur
- `findUserById(id)` - Trouve un utilisateur par ID
- `findUserByEmail(email)` - Trouve un utilisateur par email
- `listUsers(limit, skip)` - Liste les utilisateurs avec pagination
- `updateUser(id, input)` - Met à jour un utilisateur
- `deleteUser(id)` - Supprime un utilisateur
- `countUsers()` - Compte les utilisateurs
- `initializeUsersCollection()` - Initialise les index

## Utilisation avec l'authentification

Ce package est conçu pour fonctionner avec le système d'authentification du projet. Le modèle User inclut :

- **Champ `password`** : stocke le mot de passe haché (avec bcryptjs)
- **Email unique** : index unique pour éviter les doublons
- **Normalisation** : les emails sont automatiquement convertis en minuscules
- **Horodatage** : `createdAt` et `updatedAt` gérés automatiquement

### Bonnes pratiques de sécurité

1. **Toujours hasher les mots de passe** avant de les stocker :
```typescript
import { hashPassword } from '@/lib/auth';
const hashedPassword = await hashPassword(password);
const user = await createUser({ email, name, password: hashedPassword });
```

2. **Utiliser `findUserByEmail` avec le mot de passe** pour l'authentification (le mot de passe n'est pas exclu) :
```typescript
const user = await findUserByEmail(email);
if (user && user.password) {
  const isValid = await verifyPassword(password, user.password);
}
```

3. **Les fonctions `findUserById` et `listUsers`** excluent automatiquement le mot de passe des résultats pour la sécurité.

### Extensions possibles

Pour étendre le système d'authentification, vous pouvez ajouter :

1. Champ `emailVerified` (Date) pour la vérification d'email
2. Champ `resetToken` (string) pour la récupération de mot de passe
3. Champ `resetTokenExpiry` (Date) pour l'expiration du token
4. Champ `lastLogin` (Date) pour tracker les connexions
5. Champ `roles` (string[]) pour la gestion des permissions

## Structure des fichiers

```
packages/database/
├── src/
│   ├── index.ts           # Point d'entrée du package
│   ├── mongodb-client.ts  # Client MongoDB et utilitaires
│   └── user.ts            # Modèle User et opérations CRUD
├── package.json
├── tsconfig.json
├── eslint.config.js
└── README.md
```
