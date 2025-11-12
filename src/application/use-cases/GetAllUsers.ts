import { injectable, inject } from 'inversify';
import { IUserRepository } from '../../domain/ports/IUserRepository';
import { UserResponseDto, UserMapper } from '../dtos/UserDto';
import { TYPES } from '../../config/types';

@injectable()
export class GetAllUsers {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository
  ) {}

  async execute(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findAll();
    return users.map(user => UserMapper.toResponseDto(user));
  }
}

