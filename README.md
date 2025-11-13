# User Management API - Clean Architecture

API available at `http://localhost:3000/api`

## Architecture - Hexagonal (5 Layers)

This project follows Clean Architecture principles with strict separation of concerns.

### Layer Structure

```
src/
├── domain/                    # Business Core (center)
│   ├── entities/             # Business entities (User)
│   ├── value-objects/        # Value Objects (Email, PhoneNumber)
│   ├── ports/                # Interfaces (IUserRepository)
│   └── __tests__/            # Domain unit tests
│
├── application/              # Use Cases
│   ├── use-cases/           # Business operations (5 use cases)
│   └── dtos/                # Data transfer objects (all in UserDto.ts)
│
├── adapters/                 # External World
│   ├── presentation/        # HTTP layer (controllers)
│   ├── persistence/         # Data storage (in-memory)
│   └── external/            # External services (empty)
│
└── infrastructure/           # Technical Services
    └── di/                  # IoC Container (dependency injection)
```

### Dependencies Flow

```
Adapters → Application → Domain
   ↓          ↓           ↑
(depends)  (depends)  (independent)
```

The Domain is the center and has no dependencies.  
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

### Domain Layer Features

**Value Objects:**
- `Email` - Validates email format (must have @ and .)
- `PhoneNumber` - Validates phone number is not empty

**Entity:**
- `User` - Encapsulates user data and business rules
- Constructor validates all inputs
- Methods: `changeEmail()`, `changeTelephone()`, `isAdmin()`
- Profile automatically calculated based on email domain

**Tests:**
- 11 unit tests covering domain logic (entities + value objects)
- 13 unit tests covering use cases (with mocked repositories)
- 10 unit tests covering persistence layer (repository)
- 5 unit tests covering IoC container (lifetimes, dependencies)
- Total: 39 tests
- Run with: `npm test`

## API Endpoints

```bash
POST   /api/users      # Create user
GET    /api/users      # Get all users
GET    /api/users/:id  # Get user by ID
PUT    /api/users/:id  # Update user
DELETE /api/users/:id  # Delete user

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
- Contains business entities (User) and rules
- Value Objects for Email and PhoneNumber
- Defines interfaces (ports) that it needs
- 11 unit tests validate business rules

### 2. Application
- Orchestrates the business logic
- Contains Use Cases (business operations)
- Uses ports defined by Domain
- DTOs prevent Domain entities from leaking
- Mapping done directly in each Use Case

### 3. Adapters - Presentation
- HTTP controllers (dependency injection)
- Request/response handling
- Error mapping (400/404/409/500)
- Calls Use Cases exclusively (no business logic)

### 4. Adapters - Persistence
- Data storage implementation
- Implements repository interfaces from Domain
- In-memory storage (Map-based) for this project
- 10 tests covering CRUD operations

### 5. Adapters - External
- External service integrations
- Empty for this simple project
- Could contain email services, payment APIs, etc.
