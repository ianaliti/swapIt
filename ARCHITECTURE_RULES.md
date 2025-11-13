# Architecture Rules

## Dependencies

Rule 1: Domain depends on NOTHING
Rule 2: Application depends ONLY on Domain
Rule 3: Adapters depend on Application + Domain

```
Adapters → Application → Domain
```

Domain is independent.

## What to check

### 1. Domain is pure
No imports from adapters, application, or infrastructure.
No ORM annotations (@Entity, @Column).

```bash
grep -r "from.*adapters\|from.*application" src/domain --include="*.ts"
```

Should be empty.

### 2. Application only imports Domain
No imports from adapters or infrastructure.
No direct DB access (Pool, query).

```bash
grep -r "from.*adapters" src/application --include="*.ts"
```

Should be empty.

### 3. No ORM in Domain

```bash
grep -r "@Entity\|@Column" src/domain --include="*.ts"
```

Should be empty.

### 4. No DB access in Application

```bash
grep -r "Pool\|query(" src/application --include="*.ts"
```

Should be empty.

### 5. Controllers only call Use Cases
No business logic in controllers.

```bash
grep -r "determineProfile" src/adapters/presentation/controllers --include="*.ts"
```

Should be empty.

## Automatic check

```bash
npm run check:arch
```

## Common mistakes

1. Controller calls Repository directly
   Solution: Use a Use Case

2. Application imports concrete class
   Bad: import { UserRepository }
   Good: import { IUserRepository }

3. Domain uses DTO
   Bad: constructor(dto: CreateUserDto)
   Good: constructor(nom: string, prenom: string)