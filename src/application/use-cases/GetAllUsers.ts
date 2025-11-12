import { IUserRepository } from '../../domain/ports/IUserRepository';
import { UserResponseDto, UserMapper } from '../dtos/UserDto';

export class GetAllUsers {
  constructor(private userRepository: IUserRepository) {}

  async execute(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findAll();
    
    const result = [];
    for (const user of users) {
      result.push(UserMapper.toResponseDto(user));
    }
    
    return result;
  }
}
