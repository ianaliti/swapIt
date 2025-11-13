import { IQuery, IQueryHandler } from './IQuery';
import { IUserRepository } from '../../domain/ports/IUserRepository';
import { UserResponseDto } from '../dtos/UserDto';

export class GetUserQuery implements IQuery<UserResponseDto | null> {
  constructor(public id: number) {}
}

export class GetUserHandler implements IQueryHandler<GetUserQuery, UserResponseDto | null> {
  userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async handle(query: GetUserQuery): Promise<UserResponseDto | null> {
    const user = await this.userRepository.findById(query.id);

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

