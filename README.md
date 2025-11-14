# TP3 - Microservices Architecture
## Gestion des Utilisateurs et Comptes Bancaires

---

## 📖 Description du Projet

Ce projet implémente **deux microservices** pour gérer les utilisateurs et leurs comptes bancaires.

**Objectif TP3** : Créer deux services indépendants qui peuvent communiquer entre eux.

### Les Deux Services

1. **User Service** → Gère les utilisateurs (création, suppression, etc.)
2. **Account Service** → Gère les comptes bancaires (création, suppression, etc.)

**Chaque service tourne sur son propre port** :
- User Service : port **3000**
- Account Service : port **3001**

### Étape 1 : Installer les dépendances (si pas déjà fait)

#### Pour User Service
```bash
cd services/user-service
npm install
```

#### Pour Account Service
```bash
cd services/account-service
npm install
```

### Étape 2 : Lancer les deux services

**Ouvrez DEUX terminaux** :

#### Terminal 1 : User Service
```bash
cd services/user-service
npm run dev
```

**Vous devriez voir** :
```
Port: 3000
User Service is running on http://localhost:3000/api
```

#### Terminal 2 : Account Service
```bash
cd services/account-service
npm run dev
```

**Vous devriez voir** :
```
Port: 3001
Account Service is running on http://localhost:3001/api
```

---

## Tester les Services

### Test 1 : Vérifier que les services fonctionnent

**User Service** :
```bash
curl http://localhost:3000/api
```

**Account Service** :
```bash
curl http://localhost:3001/api
```

Les deux devraient répondre avec `"success": true`.

---

### Test 2 : Créer un utilisateur (POST /users)

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Dupont",
    "prenom": "Jean",
    "email": "jean.dupont@example.com",
    "telephone": "0123456789"
  }'
```

### Test 3 : Récupérer tous les utilisateurs (GET /users)

```bash
curl http://localhost:3000/api/users
```

---

### Test 4 : Supprimer un utilisateur (DELETE /users/:id)

**Remplacez `1` par l'id de l'utilisateur que vous avez créé** :
```bash
curl -X DELETE http://localhost:3000/api/users/1
```

**Réponse attendue** :
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

### Test 5 : Créer un compte bancaire (POST /accounts)

```bash
curl -X POST http://localhost:3001/api/accounts \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123",
    "currency": "EUR"
  }'
```

**Réponse attendue** :
```json
{
  "success": true,
  "data": {
    "accountId": "xxx-xxx-xxx",
    "userId": "user-123",
    "accountNumber": "ACC-1234567890",
    "balance": 0,
    "currency": "EUR",
    ...
  },
  "message": "Account created successfully"
}
```

---

### Test 6 : Supprimer un compte bancaire (DELETE /accounts/:id)

**Remplacez `ACCOUNT-ID` par l'accountId du compte créé** :
```bash
curl -X DELETE http://localhost:3001/api/accounts/ACCOUNT-ID
```

---

## 📋 Liste Complète des Endpoints

### User Service (Port 3000)

| Méthode | URL | Description |
|---------|-----|-------------|
| POST | `/api/users` | Créer un utilisateur |
| GET | `/api/users` | Récupérer tous les utilisateurs |
| GET | `/api/users/:id` | Récupérer un utilisateur par ID |
| PUT | `/api/users/:id` | Mettre à jour un utilisateur |
| DELETE | `/api/users/:id` | **Supprimer un utilisateur** |

### Account Service (Port 3001)

| Méthode | URL | Description |
|---------|-----|-------------|
| POST | `/api/accounts` | **Créer un compte bancaire** |
| GET | `/api/accounts` | Récupérer tous les comptes |
| GET | `/api/accounts/:id` | Récupérer un compte par ID |
| GET | `/api/accounts/user/:userId` | Récupérer les comptes d'un utilisateur |
| DELETE | `/api/accounts/:id` | **Supprimer un compte bancaire** |

---

## 📁 Structure du Projet

```
swap_dev/
├── services/
│   ├── user-service/          # Microservice 1
│   │   ├── src/               # Code source
│   │   ├── package.json       # Dépendances
│   │   └── tsconfig.json      # Config TypeScript
│   │
│   └── account-service/       # Microservice 2
│       ├── src/               # Code source
│       ├── package.json       # Dépendances
│       └── tsconfig.json      # Config TypeScript
│
└── README.md                  # Ce fichier
```


## 🔧 Technologies Utilisées

- **Node.js** : Environnement d'exécution
- **TypeScript** : Langage de programmation
- **Express.js** : Framework pour créer l'API REST

**Base de données** : Stockage en mémoire (pour simplifier le TP3)

---
