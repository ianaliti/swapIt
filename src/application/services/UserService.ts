import { injectable, inject } from 'inversify';
import { IUserService } from './IUserService';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { CreateUserDto, UpdateUserDto, UserResponseDto, UserMapper } from '../dtos/UserDto';
import { User } from '../../domain/entities/User';
import { TYPES } from '../../config/types';

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository
  ) {}

  async createUser(userData: CreateUserDto): Promise<UserResponseDto> {
    this.validateUserData(userData);

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

  async getUserById(id: number): Promise<UserResponseDto | null> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      return null;
    }

    return UserMapper.toResponseDto(user);
  }

  async getAllUsers(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findAll();
    return users.map(user => UserMapper.toResponseDto(user));
  }

  async updateUser(id: number, userData: UpdateUserDto): Promise<UserResponseDto | null> {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      return null;
    }

    if (Object.keys(userData).length > 0) {
      this.validateUserData(userData, true);
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

  async deleteUser(id: number): Promise<boolean> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      return false;
    }

    return await this.userRepository.delete(id);
  }

  private validateUserData(data: CreateUserDto | UpdateUserDto, isUpdate: boolean = false): void {
    if (!isUpdate) {
      const createData = data as CreateUserDto;
      if (!createData.nom?.trim()) {
        throw new Error('First name is required');
      }
      if (!createData.prenom?.trim()) {
        throw new Error('First name is required');
      }
      if (!createData.email?.trim()) {
        throw new Error('Email is required');
      }
      if (!createData.telephone?.trim()) {
        throw new Error('Phone number is required');
      }
    }

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
