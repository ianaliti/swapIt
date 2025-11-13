import { GetAllUsers } from '../GetAllUsers';
import { User } from '../../../domain/entities/User';

describe('GetAllUsers Use Case', () => {
  test('should return all users', async () => {
    const user1 = new User(1, 'Doe', 'John', 'john@test.com', '0612345678');
    const user2 = new User(2, 'Smith', 'Jane', 'jane@test.com', '0698765432');
    
    const mockRepo = {
      findAll: async () => [user1, user2],
      findById: async (id: number) => null,
      findByEmail: async (email: string) => null,
      create: async (user: any) => user,
      update: async (id: number, user: any) => null,
      delete: async (id: number) => false
    };

    const useCase = new GetAllUsers(mockRepo as any);
    const result = await useCase.execute();

    expect(result.length).toBe(2);
    expect(result[0].nom).toBe('Doe');
    expect(result[1].nom).toBe('Smith');
  });

  test('should return empty array if no users', async () => {
    const mockRepo = {
      findAll: async () => [],
      findById: async (id: number) => null,
      findByEmail: async (email: string) => null,
      create: async (user: any) => user,
      update: async (id: number, user: any) => null,
      delete: async (id: number) => false
    };

    const useCase = new GetAllUsers(mockRepo as any);
    const result = await useCase.execute();

    expect(result).toEqual([]);
  });
});

