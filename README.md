# User Management API

Simple user management API with Clean Architecture.

## Start

```bash
npm install
npm run dev
npm test
```

API: http://localhost:3000/api

## Structure

```
src/
├── domain/
│   ├── entities/
│   ├── value-objects/
│   └── ports/
├── application/
│   ├── use-cases/
│   └── dtos/
├── adapters/
│   ├── presentation/
│   ├── persistence/
│   └── external/
└── infrastructure/
    └── di/
```

## Architecture

Domain = entities + business rules
Application = use cases
Adapters = controllers + repositories
Infrastructure = IoC container

Dependencies: Adapters → Application → Domain

Domain has no dependencies.

## Business Rule

Email with @company.com = ADMINISTRATEUR
Other email = UTILISATEUR

## Endpoints

```
POST   /api/users
GET    /api/users
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id
```

## Verify Architecture

```bash
npm run check:arch
```

Checks:
- Domain is independent
- Application only imports Domain
- No ORM in Domain
- No DB access in Application
- Controllers only call Use Cases
