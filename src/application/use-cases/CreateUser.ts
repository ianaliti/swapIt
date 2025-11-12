import { IUserRepository } from '../../domain/ports/IUserRepository';
import { User } from '../../domain/entities/User';
import { CreateUserDto, UserResponseDto, UserMapper } from '../dtos/UserDto';

export class CreateUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(userData: CreateUserDto): Promise<UserResponseDto> {
    if (!userData.nom?.trim()) {
      throw new Error('Name is required');
    }
    
    if (!userData.prenom?.trim()) {
      throw new Error('First name is required');
    }
    
    if (!userData.email?.trim()) {
      throw new Error('Email is required');
    }
    
    if (!userData.telephone?.trim()) {
      throw new Error('Phone number is required');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      throw new Error('Invalid email format');
    }

    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('A user with this email already exists');
    }

    const user = new User(
      0,
      userData.nom,
      userData.prenom,
      userData.email,
      userData.telephone
    );

    const createdUser = await this.userRepository.create(user);
    
    return UserMapper.toResponseDto(createdUser);
  }
}
