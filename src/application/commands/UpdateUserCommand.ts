import { ICommand, ICommandHandler } from './ICommand';
import { IUserRepository } from '../../domain/ports/IUserRepository';
import { UpdateUserDto, UserResponseDto } from '../dtos/UserDto';

export class UpdateUserCommand implements ICommand<UserResponseDto | null> {
  constructor(
    public id: number,
    public userData: UpdateUserDto
  ) {}
}

export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand, UserResponseDto | null> {
  userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async handle(command: UpdateUserCommand): Promise<UserResponseDto | null> {
    const id = command.id;
    const userData = command.userData;
    
    console.log('Updating user:', id, userData);
    
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      return null;
    }

    if (userData.email) {
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

    return {
      id: existingUser.id,
      nom: existingUser.nom,
      prenom: existingUser.prenom,
      email: existingUser.getEmail(),
      telephone: existingUser.getTelephone(),
      profil: existingUser.getProfil(),
      createdAt: existingUser.createdAt.toISOString(),
      updatedAt: existingUser.updatedAt.toISOString()
    };
  }
}

