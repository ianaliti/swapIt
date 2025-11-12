import { UserProfile } from '../../domain/entities/User';

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
  static toResponseDto(user: any): UserResponseDto {
    return {
      id: user.id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      telephone: user.telephone,
      profil: user.profil,
      createdAt: user.created_at?.toISOString() || user.createdAt?.toISOString(),
      updatedAt: user.updated_at?.toISOString() || user.updatedAt?.toISOString()
    };
  }
}
