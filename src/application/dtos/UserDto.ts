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
