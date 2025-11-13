import { GetUser } from '../GetUser';
import { User } from '../../../domain/entities/User';

describe('GetUser Use Case', () => {
  test('should get user by id', async () => {
    const user = new User(1, 'Doe', 'John', 'john@test.com', '0612345678');
    
    const mockRepo = {
      findById: async (id: number) => {
        if (id === 1) return user;
        return null;
      },
      findByEmail: async (email: string) => null,
      create: async (user: any) => user,
      findAll: async () => [],
      update: async (id: number, user: any) => null,
      delete: async (id: number) => false
    };

    const useCase = new GetUser(mockRepo as any);
    const result = await useCase.execute(1);

    expect(result).not.toBeNull();
    if (result) {
      expect(result.id).toBe(1);
      expect(result.nom).toBe('Doe');
      expect(result.email).toBe('john@test.com');
    }
  });

  test('should return null if user not found', async () => {
    const mockRepo = {
      findById: async (id: number) => null,
      findByEmail: async (email: string) => null,
      create: async (user: any) => user,
      findAll: async () => [],
      update: async (id: number, user: any) => null,
      delete: async (id: number) => false
    };

    const useCase = new GetUser(mockRepo as any);
    const result = await useCase.execute(999);

    expect(result).toBeNull();
  });
});

