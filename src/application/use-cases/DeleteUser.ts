import { injectable, inject } from 'inversify';
import { IUserRepository } from '../../domain/ports/IUserRepository';
import { TYPES } from '../../config/types';

@injectable()
export class DeleteUser {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository
  ) {}

  async execute(id: number): Promise<boolean> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      return false;
    }

    return await this.userRepository.delete(id);
  }
}

