import { IUserRepository } from '../../domain/ports/IUserRepository';
import { UserResponseDto } from '../dtos/UserDto';

export class GetUser {
  userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async execute(id: number): Promise<UserResponseDto | null> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      return null;
    }

    const result = {
      id: user.id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.getEmail(),
      telephone: user.getTelephone(),
      profil: user.getProfil(),
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString()
    };
    
    return result;
  }
}
