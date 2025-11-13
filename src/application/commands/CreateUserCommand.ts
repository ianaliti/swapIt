import { ICommand, ICommandHandler } from './ICommand';
import { IUserRepository } from '../../domain/ports/IUserRepository';
import { User } from '../../domain/entities/User';
import { CreateUserDto, UserResponseDto } from '../dtos/UserDto';

export class CreateUserCommand implements ICommand<UserResponseDto> {
  constructor(public userData: CreateUserDto) {}
}

export class CreateUserHandler implements ICommandHandler<CreateUserCommand, UserResponseDto> {
  userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async handle(command: CreateUserCommand): Promise<UserResponseDto> {
    const userData = command.userData;
    
    console.log('Creating user:', userData);
    
    if (!userData.nom || userData.nom.trim() === '') {
      throw new Error('Name is required');
    }
    
    if (!userData.prenom || userData.prenom.trim() === '') {
      throw new Error('First name is required');
    }
    
    if (!userData.email || userData.email.trim() === '') {
      throw new Error('Email is required');
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
    
    const response: UserResponseDto = {
      id: createdUser.id,
      nom: createdUser.nom,
      prenom: createdUser.prenom,
      email: createdUser.getEmail(),
      telephone: createdUser.getTelephone(),
      profil: createdUser.getProfil(),
      createdAt: createdUser.createdAt.toISOString(),
      updatedAt: createdUser.updatedAt.toISOString()
    };
    
    return response;
  }
}

