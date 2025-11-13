import { UserResponseDto } from '../dtos/UserDto';
import { UserRepository } from '../../adapters/persistence/UserRepository';

export class GetAllUsers {
  userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findAll();
    
    const result = [];
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      result.push({
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.getEmail(),
        telephone: user.getTelephone(),
        profil: user.getProfil(),
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString()
      });
    }
    
    return result;
  }
}
