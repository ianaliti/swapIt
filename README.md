# User Management API - CQRS

API with Clean Architecture and CQRS pattern.

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
├── application/
│   ├── commands/    (write)
│   ├── queries/     (read)
│   └── dtos/
├── adapters/
└── infrastructure/
```

## CQRS Pattern

Commands = write operations (Create, Update, Delete)
Queries = read operations (Get, GetAll)

Flow:
Request → Controller → Command/Query → Bus → Handler → Response

### Commands
- CreateUserCommand
- UpdateUserCommand  
- DeleteUserCommand

### Queries
- GetUserQuery
- GetAllUsersQuery

## Business Rule

Email @company.com = ADMINISTRATEUR
Other = UTILISATEUR

## Endpoints

```
POST   /api/users
GET    /api/users
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id
```

## Check Architecture

```bash
npm run check:arch
```
