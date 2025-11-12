import { injectable, inject } from 'inversify';
import { IUserRepository } from '../../domain/ports/IUserRepository';
import { UserResponseDto, UserMapper } from '../dtos/UserDto';
import { TYPES } from '../../config/types';

@injectable()
export class GetUser {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository
  ) {}

  async execute(id: number): Promise<UserResponseDto | null> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      return null;
    }

    return UserMapper.toResponseDto(user);
  }
}

