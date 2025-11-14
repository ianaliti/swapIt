import { User } from '../entities/User';

export interface IUserRepository {
  create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
  findById(id: number): Promise<User | null>;
  findAll(): Promise<User[]>;
  update(id: number, user: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>): Promise<User | null>;
  delete(id: number): Promise<boolean>;
  findByEmail(email: string): Promise<User | null>;
}
