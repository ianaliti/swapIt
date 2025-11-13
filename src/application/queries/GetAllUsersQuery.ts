import { IQuery, IQueryHandler } from './IQuery';
import { IUserRepository } from '../../domain/ports/IUserRepository';
import { UserResponseDto } from '../dtos/UserDto';

export class GetAllUsersQuery implements IQuery<UserResponseDto[]> {}

export class GetAllUsersHandler implements IQueryHandler<GetAllUsersQuery, UserResponseDto[]> {
  userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async handle(query: GetAllUsersQuery): Promise<UserResponseDto[]> {
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

