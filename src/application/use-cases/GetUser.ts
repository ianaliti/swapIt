import { IUserRepository } from '../../domain/ports/IUserRepository';
import { UserResponseDto, UserMapper } from '../dtos/UserDto';

export class GetUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: number): Promise<UserResponseDto | null> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      return null;
    }

    return UserMapper.toResponseDto(user);
  }
}
