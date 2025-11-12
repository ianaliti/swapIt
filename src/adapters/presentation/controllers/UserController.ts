import { Request, Response } from 'express';
import { CreateUser } from '../../../application/use-cases/CreateUser';
import { GetUser } from '../../../application/use-cases/GetUser';
import { GetAllUsers } from '../../../application/use-cases/GetAllUsers';
import { UpdateUser } from '../../../application/use-cases/UpdateUser';
import { DeleteUser } from '../../../application/use-cases/DeleteUser';
import { CreateUserDto, UpdateUserDto } from '../../../application/dtos/UserDto';
import { UserRepository } from '../../persistence/UserRepository';

export class UserController {
  private createUserUseCase: CreateUser;
  private getUserUseCase: GetUser;
  private getAllUsersUseCase: GetAllUsers;
  private updateUserUseCase: UpdateUser;
  private deleteUserUseCase: DeleteUser;

  constructor() {
    const userRepository = new UserRepository();
    
    this.createUserUseCase = new CreateUser(userRepository);
    this.getUserUseCase = new GetUser(userRepository);
    this.getAllUsersUseCase = new GetAllUsers(userRepository);
    this.updateUserUseCase = new UpdateUser(userRepository);
    this.deleteUserUseCase = new DeleteUser(userRepository);
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const userData: CreateUserDto = req.body;
      
      const newUser = await this.createUserUseCase.execute(userData);

      res.status(201).json({
        success: true,
        data: newUser,
        message: 'User created successfully'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Cannot create user'
      });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: 'Invalid ID'
        });
        return;
      }

      const user = await this.getUserUseCase.execute(id);

      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'The user could not be retrieved'
      });
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.getAllUsersUseCase.execute();

      res.status(200).json({
        success: true,
        data: users,
        count: users.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'The users could not be retrieved'
      });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const userData: UpdateUserDto = req.body;

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: 'Invalid ID'
        });
        return;
      }

      const updatedUser = await this.updateUserUseCase.execute(id, userData);

      if (!updatedUser) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: updatedUser,
        message: 'User updated successfully'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'The user could not be updated'
      });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: 'Invalid ID'
        });
        return;
      }

      const deleted = await this.deleteUserUseCase.execute(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Cannot delete user'
      });
    }
  }
}
