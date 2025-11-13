import { UserRepository } from '../../adapters/persistence/UserRepository';

export class DeleteUser {
  userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(id: number): Promise<boolean> {
    console.log('Deleting user:', id);
    return this.userRepository.delete(id);
  }
}
