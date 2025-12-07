# Modèle monorepo shadcn/ui

Ce modèle est conçu pour créer un monorepo avec shadcn/ui.

## 🚀 Démarrage rapide

### Option 1: Dev Container (Recommandé)

Le projet inclut une configuration de Dev Container qui configure automatiquement l'environnement de développement avec MongoDB.

#### VS Code / GitHub Codespaces

1. Installez [VS Code](https://code.visualstudio.com/) et l'extension [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
2. Ouvrez le projet dans VS Code
3. Cliquez sur le popup "Reopen in Container" ou utilisez la commande `Dev Containers: Reopen in Container`
4. Le container se lancera automatiquement avec MongoDB prêt à l'emploi

### Option 2: CodeSandbox (Idéal pour les postes universitaires)

Vous pouvez travailler sur ce projet directement dans votre navigateur avec CodeSandbox :

[![Open in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/p/github/micmc422/TP-Nextjs-tw3)

> 💡 C'est la solution idéale si un poste universitaire est indisponible ou dysfonctionnel. MongoDB est automatiquement démarré grâce à la configuration dans `.codesandbox/tasks.json`.

### Option 3: Installation locale

Si vous préférez travailler en local sans Dev Container :

1. Installez [Docker](https://docs.docker.com/get-docker/) et [Docker Compose](https://docs.docker.com/compose/install/)
2. Installez [Node.js 20+](https://nodejs.org/)
3. Installez [pnpm](https://pnpm.io/installation)

```bash
# Activer Corepack pour pnpm
corepack enable

# Installer les dépendances
pnpm install

# Démarrer MongoDB avec Docker
docker compose up -d

# Construire les packages
pnpm --filter=./packages/* build

# Lancer le serveur de développement
pnpm dev:app
```

## 📦 Base de données MongoDB

Le projet utilise **MongoDB 6.12.0** pour la persistance des données. La configuration Docker Compose lance automatiquement une instance MongoDB accessible sur `mongodb://localhost:27017`.

Le package `@workspace/database` fournit un client MongoDB singleton et des modèles pour gérer les utilisateurs et l'authentification. Il inclut :

- **Client MongoDB** avec pattern singleton pour une connexion optimisée
- **Modèle User** avec opérations CRUD complètes
- **Index optimisés** pour les recherches par email
- **Support TypeScript** complet avec types exportés

Pour plus de détails sur l'utilisation de la base de données, consultez le [README du package database](./packages/database/README.md).

### Commandes Docker utiles

```bash
# Démarrer MongoDB
docker compose up -d

# Arrêter MongoDB
docker compose down

# Voir les logs MongoDB
docker compose logs -f mongodb

# Accéder au shell MongoDB
docker exec -it tp-nextjs-mongodb mongosh
```

## 🔐 Authentification

Le projet inclut un système d'authentification complet avec :

- **Inscription et connexion** via email/mot de passe
- **Sessions JWT** sécurisées avec la librairie `jose`
- **Hachage de mots de passe** avec `bcryptjs` (10 rounds de salt)
- **Cookies HTTP-only** pour stocker les sessions
- **Validation** des entrées utilisateur

### Configuration

Créez un fichier `.env.local` à la racine du projet web :

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=tp-nextjs

# JWT Secret (changez en production !)
JWT_SECRET=votre-secret-jwt-tres-securise
```

### Pages disponibles

- `/inscription` - Créer un nouveau compte
- `/connexion` - Se connecter avec un compte existant
- `/utilisateur` - Liste des utilisateurs (nécessite d'être connecté)
- `/utilisateur/[id]` - Détails d'un utilisateur

### Utilisation de l'authentification

```typescript
import { createSession, getSession, deleteSession, hashPassword, verifyPassword } from '@/lib/auth';
import { createUser, findUserByEmail } from '@workspace/database';

// Inscription
const hashedPassword = await hashPassword(password);
const user = await createUser({ email, name, password: hashedPassword });
await createSession(user._id.toString(), user.email, user.name);

// Connexion
const user = await findUserByEmail(email);
const isValid = await verifyPassword(password, user.password);
if (isValid) {
  await createSession(user._id.toString(), user.email, user.name);
}

// Récupérer la session
const session = await getSession();

// Déconnexion
await deleteSession();
```

## Utilisation

```bash
pnpm dlx shadcn@latest init
```

## Ajouter des composants

Pour ajouter des composants à votre application, exécutez la commande suivante à la racine de votre application `web` :

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

Cela placera les composants UI dans le répertoire `packages/ui/src/components`.

## Tailwind

Votre `tailwind.config.ts` et `globals.css` sont déjà configurés pour utiliser les composants du package `ui`.

## Utilisation des composants

Pour utiliser les composants dans votre application, importez-les depuis le package `ui`.

```tsx
import { Button } from "@workspace/ui/components/button"
```
