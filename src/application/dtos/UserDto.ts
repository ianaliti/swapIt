import { UserProfile, User } from '../../domain/entities/User';

export interface CreateUserDto {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
}

export interface UpdateUserDto {
  nom?: string;
  prenom?: string;
  email?: string;
  telephone?: string;
}

export interface UserResponseDto {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  profil: UserProfile;
  createdAt: string;
  updatedAt: string;
}

export class UserMapper {
  static toResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.getEmail(),
      telephone: user.getTelephone(),
      profil: user.getProfil(),
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString()
    };
  }
}
