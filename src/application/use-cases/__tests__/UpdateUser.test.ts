import { UpdateUser } from '../UpdateUser';
import { User } from '../../../domain/entities/User';

describe('UpdateUser Use Case', () => {
  test('should update user successfully', async () => {
    const existingUser = new User(1, 'Doe', 'John', 'john@test.com', '0612345678');
    
    const mockRepo = {
      findById: async (id: number) => existingUser,
      findByEmail: async (email: string) => null,
      create: async (user: any) => user,
      findAll: async () => [],
      update: async (id: number, user: any) => existingUser,
      delete: async (id: number) => false
    };

    const useCase = new UpdateUser(mockRepo as any);

    const result = await useCase.execute(1, {
      nom: 'Smith',
      prenom: 'Jane'
    });

    expect(result).not.toBeNull();
    if (result) {
      expect(result.nom).toBe('Smith');
      expect(result.prenom).toBe('Jane');
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

    const useCase = new UpdateUser(mockRepo as any);

    const result = await useCase.execute(999, {
      nom: 'Smith'
    });

    expect(result).toBeNull();
  });

  test('should throw error if new email already exists', async () => {
    const user1 = new User(1, 'Doe', 'John', 'john@test.com', '0612345678');
    const user2 = new User(2, 'Smith', 'Jane', 'jane@test.com', '0698765432');
    
    const mockRepo = {
      findById: async (id: number) => user1,
      findByEmail: async (email: string) => {
        if (email === 'jane@test.com') return user2;
        return null;
      },
      create: async (user: any) => user,
      findAll: async () => [],
      update: async (id: number, user: any) => user1,
      delete: async (id: number) => false
    };

    const useCase = new UpdateUser(mockRepo as any);

    await expect(
      useCase.execute(1, {
        email: 'jane@test.com'
      })
    ).rejects.toThrow('A user with this email already exists');
  });
});

