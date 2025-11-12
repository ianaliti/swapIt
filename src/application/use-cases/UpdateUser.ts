import { IUserRepository } from '../../domain/ports/IUserRepository';
import { User } from '../../domain/entities/User';
import { UpdateUserDto, UserResponseDto, UserMapper } from '../dtos/UserDto';

export class UpdateUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: number, userData: UpdateUserDto): Promise<UserResponseDto | null> {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      return null;
    }

    if (userData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        throw new Error('Invalid email format');
      }

      if (userData.email !== existingUser.getEmail()) {
        const emailExists = await this.userRepository.findByEmail(userData.email);
        if (emailExists) {
          throw new Error('A user with this email already exists');
        }

        existingUser.changeEmail(userData.email);
      }
    }

    if (userData.telephone) {
      existingUser.changeTelephone(userData.telephone);
    }

    if (userData.nom) {
      existingUser.nom = userData.nom;
    }

    if (userData.prenom) {
      existingUser.prenom = userData.prenom;
    }

    existingUser.updatedAt = new Date();

    return UserMapper.toResponseDto(existingUser);
  }
}
