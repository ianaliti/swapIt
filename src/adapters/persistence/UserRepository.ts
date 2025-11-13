import { IUserRepository } from '../../domain/ports/IUserRepository';
import { User } from '../../domain/entities/User';

export class UserRepository implements IUserRepository {
  private users: Map<number, User> = new Map();
  private currentId: number = 1;

  async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const user = new User(
      this.currentId++,
      userData.nom,
      userData.prenom,
      userData.getEmail(),
      userData.getTelephone()
    );

    this.users.set(user.id, user);
    
    return user;
  }

  async findById(id: number): Promise<User | null> {
    const user = this.users.get(id);
    
    if (!user) {
      return null;
    }
    
    return user;
  }

  async findAll(): Promise<User[]> {
    const allUsers = Array.from(this.users.values());
    return allUsers;
  }

  async update(id: number, userData: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>): Promise<User | null> {
    const user = this.users.get(id);
    if (!user) {
      return null;
    }

    if (userData.nom !== undefined) {
      user.nom = userData.nom;
    }
    if (userData.prenom !== undefined) {
      user.prenom = userData.prenom;
    }
    if (userData.getEmail && userData.getEmail() !== user.getEmail()) {
      user.changeEmail(userData.getEmail());
    }
    if (userData.getTelephone) {
      user.changeTelephone(userData.getTelephone());
    }
    
    user.updatedAt = new Date();

    return user;
  }

  async delete(id: number): Promise<boolean> {
    return this.users.delete(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.getEmail() === email) {
        return user;
      }
    }
    
    return null;
  }
}
