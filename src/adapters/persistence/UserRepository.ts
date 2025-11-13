import { IUserRepository } from '../../domain/ports/IUserRepository';
import { User } from '../../domain/entities/User';

export class UserRepository implements IUserRepository {
  private users: Map<number, User>;
  private nextId: number;

  constructor() {
    this.users = new Map();
    this.nextId = 1;
  }

  async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    console.log('Repository: Creating user');
    
    const user = new User(
      this.nextId,
      userData.nom,
      userData.prenom,
      userData.getEmail(),
      userData.getTelephone()
    );

    this.users.set(this.nextId, user);
    this.nextId = this.nextId + 1;
    
    return user;
  }

  async findById(id: number): Promise<User | null> {
    const user = this.users.get(id);
    
    if (user) {
      return user;
    } else {
      return null;
    }
  }

  async findAll(): Promise<User[]> {
    const result = [];
    for (const user of this.users.values()) {
      result.push(user);
    }
    return result;
  }

  async update(id: number, userData: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>): Promise<User | null> {
    console.log('Repository: Updating user', id);
    
    const user = this.users.get(id);
    if (!user) {
      return null;
    }

    if (userData.nom) {
      user.nom = userData.nom;
    }
    if (userData.prenom) {
      user.prenom = userData.prenom;
    }
    if (userData.getEmail) {
      if (userData.getEmail() !== user.getEmail()) {
        user.changeEmail(userData.getEmail());
      }
    }
    if (userData.getTelephone) {
      user.changeTelephone(userData.getTelephone());
    }
    
    user.updatedAt = new Date();

    return user;
  }

  async delete(id: number): Promise<boolean> {
    console.log('Repository: Deleting user', id);
    
    const exists = this.users.has(id);
    if (exists) {
      this.users.delete(id);
      return true;
    } else {
      return false;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    const allUsers = Array.from(this.users.values());
    
    for (let i = 0; i < allUsers.length; i++) {
      if (allUsers[i].getEmail() === email) {
        return allUsers[i];
      }
    }
    
    return null;
  }
}
