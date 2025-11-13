import { User } from '../../domain/entities/User';
import { CreateUserDto, UserResponseDto } from '../dtos/UserDto';
import { UserRepository } from '../../adapters/persistence/UserRepository';

export class CreateUser {
  userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(userData: CreateUserDto): Promise<UserResponseDto> {
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
