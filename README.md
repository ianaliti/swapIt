# User Management API - Architecture N-Layer

L'API sera disponible sur `http://localhost:3000/api`

## Endpoints

### Créer un utilisateur
```bash
POST /api/users
Content-Type: application/json

{
  "nom": "Dupont",
  "prenom": "Marie",
  "email": "marie@company.com",
  "telephone": "0612345678"
}
```

### Obtenir tous les utilisateurs
```bash
GET /api/users
```

### Obtenir un utilisateur par ID
```bash
GET /api/users/:id
```

### Mettre à jour un utilisateur
```bash
PUT /api/users/:id
Content-Type: application/json

{
  "nom": "Martin",
  "email": "marie@gmail.com"
}
```

### Supprimer un utilisateur
```bash
DELETE /api/users/:id
```

## Architecture

### Structure du projet

```
src/
├── config/                 # Configuration DI
├── domain/                 # Entités et interfaces
│   ├── entities/
│   └── repositories/
├── application/            # Logique métier
│   ├── dtos/
│   └── services/
├── infrastructure/         # Accès aux données
│   └── repositories/
└── presentation/           # Controllers HTTP
    ├── controllers/
    ├── routes/
    └── middleware/
```

### Les 3 couches

1. **Presentation** (Controllers) - Gère les requêtes HTTP
2. **Application** (Services) - Logique métier
3. **Infrastructure** (Repositories) - Stockage des données (en mémoire)

### Règle métier

Si l'email se termine par `@company.com`, le profil est `ADMINISTRATEUR`, sinon `UTILISATEUR`.
