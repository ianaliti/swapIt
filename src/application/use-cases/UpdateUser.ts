import { injectable, inject } from 'inversify';
import { IUserRepository } from '../../domain/ports/IUserRepository';
import { User } from '../../domain/entities/User';
import { UpdateUserDto, UserResponseDto, UserMapper } from '../dtos/UserDto';
import { TYPES } from '../../config/types';

@injectable()
export class UpdateUser {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository
  ) {}

  async execute(id: number, userData: UpdateUserDto): Promise<UserResponseDto | null> {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      return null;
    }

    if (Object.keys(userData).length > 0) {
      this.validate(userData);
    }

    if (userData.email && userData.email !== existingUser.email) {
      const emailExists = await this.userRepository.findByEmail(userData.email);
      if (emailExists) {
        throw new Error('A user with this email already exists');
      }

      const newProfil = User.determineProfile(userData.email);
      userData = { ...userData, profil: newProfil };
    }

    const updatedUser = await this.userRepository.update(id, userData);

    if (!updatedUser) {
      return null;
    }

    return UserMapper.toResponseDto(updatedUser);
  }

  private validate(data: UpdateUserDto): void {
    if (data.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw new Error('Invalid email format');
      }
    }

    if (data.telephone) {
      const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
      if (!phoneRegex.test(data.telephone)) {
        throw new Error('Invalid phone number format');
      }
    }
  }
}

