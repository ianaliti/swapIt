import { injectable, inject } from 'inversify';
import { IUserRepository } from '../../domain/ports/IUserRepository';
import { User } from '../../domain/entities/User';
import { CreateUserDto, UserResponseDto, UserMapper } from '../dtos/UserDto';
import { TYPES } from '../../config/types';

@injectable()
export class CreateUser {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository
  ) {}

  async execute(userData: CreateUserDto): Promise<UserResponseDto> {
    this.validate(userData);

    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('A user with this email already exists');
    }

    const profil = User.determineProfile(userData.email);

    const userToCreate = {
      nom: userData.nom,
      prenom: userData.prenom,
      email: userData.email,
      telephone: userData.telephone,
      profil: profil
    };

    const createdUser = await this.userRepository.create(userToCreate);
    return UserMapper.toResponseDto(createdUser);
  }

  private validate(data: CreateUserDto): void {
    if (!data.nom?.trim()) {
      throw new Error('Name is required');
    }
    if (!data.prenom?.trim()) {
      throw new Error('First name is required');
    }
    if (!data.email?.trim()) {
      throw new Error('Email is required');
    }
    if (!data.telephone?.trim()) {
      throw new Error('Phone number is required');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new Error('Invalid email format');
    }

    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
    if (!phoneRegex.test(data.telephone)) {
      throw new Error('Invalid phone number format');
    }
  }
}

