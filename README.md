# User Management API - Clean Architecture

## Installation

```bash
npm install
npm run dev
```

API available at `http://localhost:3000/api`

## Architecture - Hexagonal (5 Layers)

This project follows Clean Architecture principles with strict separation of concerns.

### Layer Structure

```
src/
├── domain/                    # Business Core (center)
│   ├── entities/             # Business entities
│   └── ports/                # Interfaces (contracts)
│
├── application/              # Use Cases
│   ├── use-cases/           # Business operations
│   └── dtos/                # Data transfer objects
│
└── adapters/                 # External World
    ├── presentation/        # HTTP layer
    ├── persistence/         # Data storage
    └── external/            # External services
```

### Dependencies Flow

```
Adapters → Application → Domain
   ↓          ↓           ↑
(depends)  (depends)  (independent)
```

The **Domain** is the center and has **no dependencies**.  
Everything depends on the Domain, not the other way around.

### Use Cases

Each operation is a separate Use Case:

- `CreateUser` - Create new user
- `GetUser` - Get user by ID
- `GetAllUsers` - Get all users
- `UpdateUser` - Update user
- `DeleteUser` - Delete user

### Business Rules

The profile assignment rule lives in the **Domain layer**:

- Email ending with `@company.com` → `ADMINISTRATEUR`
- Other emails → `UTILISATEUR`

This rule is in `domain/entities/User.ts` and is independent of any framework or database.

## API Endpoints

```bash
POST   /api/users      # Create user
GET    /api/users      # Get all users
GET    /api/users/:id  # Get user by ID
PUT    /api/users/:id  # Update user
DELETE /api/users/:id  # Delete user
```

## Example

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Dupont",
    "prenom": "Marie",
    "email": "marie@company.com",
    "telephone": "0612345678"
  }'
```

## Design Choices

### Why Clean Architecture?

1. **Independence**: Business logic is isolated from frameworks
2. **Testability**: Easy to test without external dependencies
3. **Flexibility**: Can change database or framework without touching business logic
4. **Maintainability**: Clear separation of concerns

### Ports and Adapters

- **Ports** (interfaces) are in the Domain layer
- **Adapters** (implementations) are in the adapters layer
- The Domain defines what it needs (ports)
- Adapters provide implementations

### Use Cases vs Services

Instead of generic services, we have specific Use Cases:
- Each Use Case does ONE thing
- Easy to understand what the application does
- Easy to test individually

## Layers Explained

### 1. Domain (Core)
- **No dependencies** on other layers
- Contains business entities and rules
- Defines interfaces (ports) that it needs

### 2. Application
- Orchestrates the business logic
- Contains Use Cases (business operations)
- Uses ports defined by Domain

### 3. Adapters - Presentation
- HTTP controllers
- Request/response handling
- Calls Use Cases

### 4. Adapters - Persistence
- Data storage implementation
- Implements repository interfaces from Domain
- In-memory storage for this project

### 5. Adapters - External
- External service integrations
- Empty for this simple project
- Could contain email services, payment APIs, etc.
