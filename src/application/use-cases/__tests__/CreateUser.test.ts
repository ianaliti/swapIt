import { CreateUser } from '../CreateUser';
import { User } from '../../../domain/entities/User';
import { UserRepository } from '../../../adapters/persistence/UserRepository';

describe('CreateUser Use Case', () => {
  test('should create user successfully', async () => {
    const mockRepo = {
      findByEmail: async (email: string) => null,
      create: async (user: any) => {
        return new User(1, 'Doe', 'John', 'john@test.com', '0612345678');
      },
      findById: async (id: number) => null,
      findAll: async () => [],
      update: async (id: number, user: any) => null,
      delete: async (id: number) => false
    };

    const useCase = new CreateUser(mockRepo as any);

    const result = await useCase.execute({
      nom: 'Doe',
      prenom: 'John',
      email: 'john@test.com',
      telephone: '0612345678'
    });

    expect(result.nom).toBe('Doe');
    expect(result.email).toBe('john@test.com');
  });

  test('should throw error if name is empty', async () => {
    const mockRepo = new UserRepository();
    const useCase = new CreateUser(mockRepo);

    await expect(
      useCase.execute({
        nom: '',
        prenom: 'John',
        email: 'john@test.com',
        telephone: '0612345678'
      })
    ).rejects.toThrow('Name is required');
  });

  test('should throw error if email already exists', async () => {
    const existingUser = new User(1, 'Doe', 'John', 'john@test.com', '0612345678');
    
    const mockRepo = {
      findByEmail: async (email: string) => existingUser,
      create: async (user: any) => user,
      findById: async (id: number) => null,
      findAll: async () => [],
      update: async (id: number, user: any) => null,
      delete: async (id: number) => false
    };

    const useCase = new CreateUser(mockRepo as any);

    await expect(
      useCase.execute({
        nom: 'Doe',
        prenom: 'John',
        email: 'john@test.com',
        telephone: '0612345678'
      })
    ).rejects.toThrow('A user with this email already exists');
  });

  test('should throw error for invalid email format', async () => {
    const mockRepo = new UserRepository();
    const useCase = new CreateUser(mockRepo);

    await expect(
      useCase.execute({
        nom: 'Doe',
        prenom: 'John',
        email: 'invalid-email',
        telephone: '0612345678'
      })
    ).rejects.toThrow('Invalid email format');
  });
});

