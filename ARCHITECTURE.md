# Clean Architecture - Structure

## Layer Overview

```
┌─────────────────────────────────────────────────────────┐
│                    ADAPTERS                             │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │Presentation │  │ Persistence  │  │  External    │  │
│  │  (HTTP)     │  │   (Data)     │  │  (Services)  │  │
│  └──────┬──────┘  └──────┬───────┘  └──────┬───────┘  │
│         │                │                   │          │
└─────────┼────────────────┼───────────────────┼──────────┘
          │                │                   │
          ↓                ↓                   ↓
┌─────────────────────────────────────────────────────────┐
│                   APPLICATION                           │
│                    (Use Cases)                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │CreateUser│  │ GetUser  │  │UpdateUser│  ...        │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘             │
│       │             │              │                    │
└───────┼─────────────┼──────────────┼────────────────────┘
        │             │              │
        ↓             ↓              ↓
┌─────────────────────────────────────────────────────────┐
│                     DOMAIN                              │
│                   (Business Core)                       │
│  ┌─────────────┐        ┌────────────────┐            │
│  │  Entities   │        │  Ports         │            │
│  │    User     │        │ IUserRepository│            │
│  └─────────────┘        └────────────────┘            │
│                                                         │
│  NO DEPENDENCIES - Pure Business Logic                 │
└─────────────────────────────────────────────────────────┘
```

## Dependency Rule

Dependencies point INWARD only:

- Adapters depend on Application
- Application depends on Domain
- Domain depends on NOTHING

## Project Structure

```
src/
├── domain/                          # Layer 1: Business Core
│   ├── entities/
│   │   └── User.ts                 # Business entity + rules
│   └── ports/
│       └── IUserRepository.ts      # Interface (port)
│
├── application/                     # Layer 2: Use Cases
│   ├── use-cases/
│   │   ├── CreateUser.ts          # Create user operation
│   │   ├── GetUser.ts             # Get single user
│   │   ├── GetAllUsers.ts         # Get all users
│   │   ├── UpdateUser.ts          # Update user
│   │   └── DeleteUser.ts          # Delete user
│   └── dtos/
│       └── UserDto.ts             # Data transfer objects
│
├── adapters/                        # Layer 3,4,5: External World
│   ├── presentation/               # Layer 3: HTTP
│   │   ├── controllers/
│   │   │   └── UserController.ts
│   │   ├── routes/
│   │   │   └── userRoutes.ts
│   │   └── middleware/
│   │       └── errorHandler.ts
│   │
│   ├── persistence/                # Layer 4: Data Storage
│   │   └── UserRepository.ts      # Implements IUserRepository
│   │
│   └── external/                   # Layer 5: External Services
│       └── (empty for now)
│
├── config/
│   ├── types.ts                   # DI symbols
│   └── container.ts               # Dependency injection
│
└── index.ts                        # Application entry point
```

## Key Concepts

### 1. Ports (Interfaces)

Defined in **Domain**, implemented in **Adapters**:

```typescript
// domain/ports/IUserRepository.ts
export interface IUserRepository {
  create(user): Promise<User>;
  findById(id): Promise<User | null>;
}
```

### 2. Use Cases

Each business operation is isolated:

```typescript
// application/use-cases/CreateUser.ts
class CreateUser {
  async execute(data): Promise<UserDto> {
    // Orchestrate the operation
  }
}
```

### 3. Adapters

Implement ports and call use cases:

```typescript
// adapters/persistence/UserRepository.ts
class UserRepository implements IUserRepository {
  // Implementation details
}

// adapters/presentation/controllers/UserController.ts
class UserController {
  constructor(private createUser: CreateUser) {}
}
```

## Benefits

1. **Testability**: Mock adapters, test use cases
2. **Independence**: Change DB without touching business logic
3. **Clarity**: Each layer has one responsibility
4. **Flexibility**: Easy to add new features

## Business Rule Location

The profile assignment rule is in `domain/entities/User.ts`:

```typescript
static determineProfile(email: string): UserProfile {
  const domain = email.split('@')[1];
  return domain === 'company.com' 
    ? UserProfile.ADMINISTRATEUR 
    : UserProfile.UTILISATEUR;
}
```

This ensures business logic stays independent of:
- Database
- HTTP framework
- External services

