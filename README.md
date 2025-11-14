# TP3 - Microservices

Deux microservices indépendants pour gérer les utilisateurs et leurs comptes bancaires.

---

## 🚀 Démarrage Rapide

### 1. Installer les dépendances

**Terminal 1** - User Service :
```bash
cd services/user-service
npm install
```

**Terminal 2** - Account Service :
```bash
cd services/account-service
npm install
```

### 2. Lancer les services

**Terminal 1** - User Service (port 3000) :
```bash
cd services/user-service
npm run dev
```

**Terminal 2** - Account Service (port 3001) :
```bash
cd services/account-service
npm run dev
```

✅ Les deux services doivent être lancés en même temps !

---

## 🧪 Tests Rapides

### Test 1 : Vérifier que ça fonctionne

```bash
# User Service
curl http://localhost:3000/api

# Account Service
curl http://localhost:3001/api
```

### Test 2 : Créer un utilisateur

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

💡 **Important** : Quand vous créez un utilisateur, un compte bancaire est créé automatiquement !

### Test 3 : Voir les comptes d'un utilisateur

```bash
# Remplacez 1 par l'ID de l'utilisateur créé
curl http://localhost:3001/api/accounts/user/1
```

### Test 4 : Supprimer un utilisateur

```bash
# Remplacez 1 par l'ID de l'utilisateur
curl -X DELETE http://localhost:3000/api/users/1
```

💡 **Important** : Quand vous supprimez un utilisateur, tous ses comptes sont supprimés automatiquement !

---

## 🔄 Étape 2 : Transactions Atomiques

Le User Service garantit que les données restent cohérentes :

### ✅ Création d'utilisateur

1. Crée l'utilisateur
2. Crée automatiquement un compte bancaire
3. **Si le compte échoue** → supprime l'utilisateur (rollback)

### ✅ Suppression d'utilisateur

1. Supprime tous les comptes de l'utilisateur
2. **Si la suppression des comptes échoue** → l'utilisateur n'est pas supprimé
3. Si tout est OK → supprime l'utilisateur

### 🧪 Test : Simuler une erreur

1. **Éteignez Account Service** (Ctrl+C dans le Terminal 2)
2. **Essayez de créer un utilisateur** :
   ```bash
   curl -X POST http://localhost:3000/api/users \
     -H "Content-Type: application/json" \
     -d '{
       "nom": "Test",
       "prenom": "Error",
       "email": "test@example.com",
       "telephone": "0123456789"
     }'
   ```
3. **Résultat** : Erreur + l'utilisateur n'est **PAS** créé ✅

---

## 📡 Endpoints Disponibles

### User Service (Port 3000)

| Méthode | URL | Description |
|---------|-----|-------------|
| POST | `/api/users` | Créer un utilisateur |
| GET | `/api/users` | Liste des utilisateurs |
| GET | `/api/users/:id` | Détails d'un utilisateur |
| PUT | `/api/users/:id` | Modifier un utilisateur |
| DELETE | `/api/users/:id` | Supprimer un utilisateur |

### Account Service (Port 3001)

| Méthode | URL | Description |
|---------|-----|-------------|
| POST | `/api/accounts` | Créer un compte |
| GET | `/api/accounts` | Liste des comptes |
| GET | `/api/accounts/:id` | Détails d'un compte |
| GET | `/api/accounts/user/:userId` | Comptes d'un utilisateur |
| DELETE | `/api/accounts/:id` | Supprimer un compte |

---

## 📁 Structure du Projet

```
swap_dev/
├── services/
│   ├── user-service/      # Port 3000
│   └── account-service/   # Port 3001
└── README.md
```

---

## 🔧 Technologies

- **Node.js** + **TypeScript**
- **Express.js** (API REST)
- **Axios** (communication entre services)
- **Stockage en mémoire** (pour simplifier)

---

## ✅ Status

- ✅ **Étape 1** : Deux microservices indépendants
- ✅ **Étape 2** : Transactions atomiques avec rollback
- 🔜 **Étape 3** : API agrégée (à venir)

---

**Projet** : TP3 - Architecture Logicielle  
**Année** : 2025
