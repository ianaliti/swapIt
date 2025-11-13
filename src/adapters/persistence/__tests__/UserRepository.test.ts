import { UserRepository } from '../UserRepository';
import { User } from '../../../domain/entities/User';

describe('UserRepository', () => {
  test('should create user and increment ID', async () => {
    const repo = new UserRepository();
    
    const user1 = new User(0, 'Doe', 'John', 'john@test.com', '0612345678');
    const created1 = await repo.create(user1);
    
    const user2 = new User(0, 'Smith', 'Jane', 'jane@test.com', '0698765432');
    const created2 = await repo.create(user2);

    expect(created1.id).toBe(1);
    expect(created2.id).toBe(2);
  });

  test('should find user by id', async () => {
    const repo = new UserRepository();
    
    const user = new User(0, 'Doe', 'John', 'john@test.com', '0612345678');
    const created = await repo.create(user);
    
    const found = await repo.findById(created.id);

    expect(found).not.toBeNull();
    if (found) {
      expect(found.nom).toBe('Doe');
      expect(found.getEmail()).toBe('john@test.com');
    }
  });

  test('should return null if user not found by id', async () => {
    const repo = new UserRepository();
    
    const found = await repo.findById(999);

    expect(found).toBeNull();
  });

  test('should find user by email', async () => {
    const repo = new UserRepository();
    
    const user = new User(0, 'Doe', 'John', 'john@test.com', '0612345678');
    await repo.create(user);
    
    const found = await repo.findByEmail('john@test.com');

    expect(found).not.toBeNull();
    if (found) {
      expect(found.nom).toBe('Doe');
    }
  });

  test('should return null if user not found by email', async () => {
    const repo = new UserRepository();
    
    const found = await repo.findByEmail('notfound@test.com');

    expect(found).toBeNull();
  });

  test('should find all users', async () => {
    const repo = new UserRepository();
    
    const user1 = new User(0, 'Doe', 'John', 'john@test.com', '0612345678');
    const user2 = new User(0, 'Smith', 'Jane', 'jane@test.com', '0698765432');
    
    await repo.create(user1);
    await repo.create(user2);
    
    const all = await repo.findAll();

    expect(all.length).toBe(2);
  });

  test('should update user', async () => {
    const repo = new UserRepository();
    
    const user = new User(0, 'Doe', 'John', 'john@test.com', '0612345678');
    const created = await repo.create(user);
    
    created.nom = 'Smith';
    const updated = await repo.update(created.id, created);

    expect(updated).not.toBeNull();
    if (updated) {
      expect(updated.nom).toBe('Smith');
    }
  });

  test('should return null when updating non-existent user', async () => {
    const repo = new UserRepository();
    
    const user = new User(0, 'Doe', 'John', 'john@test.com', '0612345678');
    const updated = await repo.update(999, user);

    expect(updated).toBeNull();
  });

  test('should delete user', async () => {
    const repo = new UserRepository();
    
    const user = new User(0, 'Doe', 'John', 'john@test.com', '0612345678');
    const created = await repo.create(user);
    
    const deleted = await repo.delete(created.id);

    expect(deleted).toBe(true);
    
    const found = await repo.findById(created.id);
    expect(found).toBeNull();
  });

  test('should return false when deleting non-existent user', async () => {
    const repo = new UserRepository();
    
    const deleted = await repo.delete(999);

    expect(deleted).toBe(false);
  });
});

