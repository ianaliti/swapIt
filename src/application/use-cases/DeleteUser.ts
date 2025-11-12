import { IUserRepository } from '../../domain/ports/IUserRepository';

export class DeleteUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: number): Promise<boolean> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      return false;
    }

    return await this.userRepository.delete(id);
  }
}
