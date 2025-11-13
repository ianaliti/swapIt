import { DeleteUser } from '../DeleteUser';

describe('DeleteUser Use Case', () => {
  test('should delete user successfully', async () => {
    const mockRepo = {
      delete: async (id: number) => true,
      findById: async (id: number) => null,
      findByEmail: async (email: string) => null,
      create: async (user: any) => user,
      findAll: async () => [],
      update: async (id: number, user: any) => null
    };

    const useCase = new DeleteUser(mockRepo as any);
    const result = await useCase.execute(1);

    expect(result).toBe(true);
  });

  test('should return false if user not found', async () => {
    const mockRepo = {
      delete: async (id: number) => false,
      findById: async (id: number) => null,
      findByEmail: async (email: string) => null,
      create: async (user: any) => user,
      findAll: async () => [],
      update: async (id: number, user: any) => null
    };

    const useCase = new DeleteUser(mockRepo as any);
    const result = await useCase.execute(999);

    expect(result).toBe(false);
  });
});

