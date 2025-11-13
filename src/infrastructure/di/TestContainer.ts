import { Container } from './Container';
import { IUserRepository } from '../../domain/ports/IUserRepository';
import { CreateUser } from '../../application/use-cases/CreateUser';
import { GetUser } from '../../application/use-cases/GetUser';
import { GetAllUsers } from '../../application/use-cases/GetAllUsers';
import { UpdateUser } from '../../application/use-cases/UpdateUser';
import { DeleteUser } from '../../application/use-cases/DeleteUser';
import { User } from '../../domain/entities/User';

class MockUserRepository implements IUserRepository {
  private users: User[] = [];

  async create(user: any): Promise<User> {
    const newUser = new User(1, user.nom, user.prenom, user.getEmail(), user.getTelephone());
    this.users.push(newUser);
    return newUser;
  }

  async findById(id: number): Promise<User | null> {
    const user = this.users.find(u => u.id === id);
    if (user) {
      return user;
    }
    return null;
  }

  async findAll(): Promise<User[]> {
    return [...this.users];
  }

  async update(id: number, user: any): Promise<User | null> {
    const index = this.users.findIndex(u => u.id === id);
    if (index >= 0) {
      return this.users[index];
    }
    return null;
  }

  async delete(id: number): Promise<boolean> {
    const initialLength = this.users.length;
    this.users = this.users.filter(u => u.id !== id);
    return this.users.length < initialLength;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find(u => u.getEmail() === email);
    if (user) {
      return user;
    }
    return null;
  }
}

export function configureTestContainer(): Container {
  const container = new Container();

  console.log('=== Configuring TEST Container ===');

  container.register(
    'IUserRepository',
    () => new MockUserRepository(),
    'singleton'
  );

  container.register(
    'CreateUser',
    () => {
      const repo = container.resolve<IUserRepository>('IUserRepository');
      return new CreateUser(repo);
    },
    'transient'
  );

  container.register(
    'GetUser',
    () => {
      const repo = container.resolve<IUserRepository>('IUserRepository');
      return new GetUser(repo);
    },
    'transient'
  );

  container.register(
    'GetAllUsers',
    () => {
      const repo = container.resolve<IUserRepository>('IUserRepository');
      return new GetAllUsers(repo);
    },
    'transient'
  );

  container.register(
    'UpdateUser',
    () => {
      const repo = container.resolve<IUserRepository>('IUserRepository');
      return new UpdateUser(repo);
    },
    'transient'
  );

  container.register(
    'DeleteUser',
    () => {
      const repo = container.resolve<IUserRepository>('IUserRepository');
      return new DeleteUser(repo);
    },
    'transient'
  );

  console.log('=== TEST Container configured ===\n');

  return container;
}

