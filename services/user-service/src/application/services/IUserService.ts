import { CreateUserDto, UpdateUserDto, UserResponseDto } from '../dtos/UserDto';

export interface IUserService {
  createUser(userData: CreateUserDto): Promise<UserResponseDto>;
  getUserById(id: number): Promise<UserResponseDto | null>;
  getAllUsers(): Promise<UserResponseDto[]>;
  updateUser(id: number, userData: UpdateUserDto): Promise<UserResponseDto | null>;
  deleteUser(id: number): Promise<boolean>;
}
