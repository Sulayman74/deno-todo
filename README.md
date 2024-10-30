
# Deno-Todo

Un projet Deno utilisant Oak pour le serveur HTTP et djwt pour la gestion des tokens JWT. Cette application permet aux utilisateurs de s'inscrire, se connecter, et gérer des todos de manière sécurisée.

## Fonctionnalités

- **Auth JWT** : Inscription et connexion sécurisées avec génération de token JWT.
- **CRUD Todo** : Création, lecture, mise à jour et suppression de todos.
- **Middleware** : Gestion des autorisations pour protéger les routes avec JWT.
- **TypeScript** : Typage strict avec une configuration TypeScript stricte.

## Prérequis

- **Deno** 2.0 ou plus récent : [Installation Deno](https://deno.land/#installation)

## Installation

1. **Clonez le dépôt** :
   ```bash
   git clone https://github.com/votre_nom/deno-todo.git
   cd deno-todo
   ```

2. **Créer un fichier `.env`** :
   Créez un fichier `.env` à la racine du projet pour définir votre clé secrète JWT :
   ```
   JWT_SECRET=votre_secret_jwt
   ```

3. **Lancer le serveur** :
   Utilisez cette commande pour démarrer le serveur Deno :
   ```bash
   deno run --allow-net --allow-env src/server.ts
   ```

## Endpoints de l'API

- **POST** `/signup` : Inscription d'un nouvel utilisateur
- **POST** `/login` : Connexion d'un utilisateur et génération d'un token JWT
- **POST** `/todos` : Créer un todo (authentification requise)
- **GET** `/todos` : Liste des todos (authentification requise)
- **PUT** `/todos/:id` : Mise à jour d'un todo (authentification requise)
- **DELETE** `/todos/:id` : Suppression d'un todo (authentification requise)

## Structure du Projet

```plaintext
deno-todo/
├── src/
│   ├── server.ts          # Serveur principal
│   ├── routes.ts          # Routes de l'API
│   ├── controllers/       # Gestionnaires pour les endpoints
│   ├── middlewares/       # Middleware pour auth et autres
│   └── utils/             # Fonctions utilitaires
├── .env                   # Variables d'environnement
├── .gitignore             # Fichiers à ignorer
└── README.md              # Documentation du projet
```

## Technologies Utilisées

- **Deno** : Environnement d'exécution JavaScript et TypeScript.
- **Oak** : Middleware HTTP pour Deno.
- **djwt** : Pour la gestion et la validation des tokens JWT.
- **TypeScript** : Langage avec typage statique pour garantir la robustesse.

## Contribuer

1. Fork le projet.
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/FeatureName`).
3. Commitez vos modifications (`git commit -m 'Add some FeatureName'`).
4. Poussez votre branche (`git push origin feature/FeatureName`).
5. Ouvrez une Pull Request.

## License

Distribué sous la licence MIT. Voir `LICENSE` pour plus d'informations.
