# TP3 - Microservices

Deux microservices indépendants pour gérer les utilisateurs et leurs comptes bancaires.


User Service (port 3000):

Account Service (port 3001) :

```bash

### Objectif

Créer une requête qui retourne :
- Le **nom** et **prénom** de l'utilisateur
- La **liste de ses comptes bancaires**

### Solution : Service Composite

Un **endpoint dans User Service** qui agrège les données des deux services.

### Endpoint créé

```
GET /api/users/:id/with-accounts
```

### Comment ça fonctionne ?

```
1. Client appelle : GET /api/users/1/with-accounts
   ↓
2. UserController.getUserWithAccounts() est exécuté
   ↓
3. Récupère l'utilisateur depuis User Service (base locale)
   ↓
4. Appelle Account Service via HTTP (appel API)
   GET http://localhost:3001/api/accounts/user/1
   ↓
5. Combine les deux résultats
   ↓
6. Retourne : nom, prénom + liste des comptes
```

### Pourquoi cette approche ?

- ✅ **Simple** : tout dans le User Service (service composite)
- ✅ **Synchrone** : données à jour immédiatement
- ✅ **Facile à comprendre** : logique claire dans le controller
- ✅ **Pas besoin d'API Gateway** : trop complexe pour un projet étudiant

---


- `POST /api/accounts` - Créer un compte
- `GET /api/accounts` - Liste des comptes
- `GET /api/accounts/:id` - Détails d'un compte
- `GET /api/accounts/user/:userId` - Comptes d'un utilisateur
- `DELETE /api/accounts/:id` - Supprimer un compte


## Structure

```
swap_dev/
├── services/
│   ├── user-service/
│   │   └── src/
│   │       └── presentation/
│   │           └── controllers/
│   │               └── UserController.ts  
│   │           └── routes/
│   │               └── userRoutes.ts      
│   └── account-service/
└── README.md
```

---

## Technologies

- **Node.js** + **TypeScript**
- **Express.js** (API REST)
- **Axios** (appels HTTP entre services)

---
