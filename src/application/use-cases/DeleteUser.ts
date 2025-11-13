import { IUserRepository } from '../../domain/ports/IUserRepository';

export class DeleteUser {
  userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async execute(id: number): Promise<boolean> {
    console.log('Deleting user:', id);
    return this.userRepository.delete(id);
  }
}
