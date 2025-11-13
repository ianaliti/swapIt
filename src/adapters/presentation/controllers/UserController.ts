import { Request, Response } from 'express';
import { CreateUser } from '../../../application/use-cases/CreateUser';
import { GetUser } from '../../../application/use-cases/GetUser';
import { GetAllUsers } from '../../../application/use-cases/GetAllUsers';
import { UpdateUser } from '../../../application/use-cases/UpdateUser';
import { DeleteUser } from '../../../application/use-cases/DeleteUser';
import { CreateUserDto, UpdateUserDto } from '../../../application/dtos/UserDto';

export class UserController {
  createUserUseCase: CreateUser;
  getUserUseCase: GetUser;
  getAllUsersUseCase: GetAllUsers;
  updateUserUseCase: UpdateUser;
  deleteUserUseCase: DeleteUser;

  constructor(
    createUserUseCase: CreateUser,
    getUserUseCase: GetUser,
    getAllUsersUseCase: GetAllUsers,
    updateUserUseCase: UpdateUser,
    deleteUserUseCase: DeleteUser
  ) {
    this.createUserUseCase = createUserUseCase;
    this.getUserUseCase = getUserUseCase;
    this.getAllUsersUseCase = getAllUsersUseCase;
    this.updateUserUseCase = updateUserUseCase;
    this.deleteUserUseCase = deleteUserUseCase;
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      console.log('Controller: Creating user');
      
      const userData: CreateUserDto = req.body;
      
      const newUser = await this.createUserUseCase.execute(userData);

      res.status(201).json({
        success: true,
        data: newUser,
        message: 'User created successfully'
      });
    } catch (error: any) {
      console.error('Controller error:', error.message);
      
      if (error.message.includes('already exists')) {
        res.status(409).json({
          success: false,
          error: error.message
        });
      } else if (error.message.includes('required') || error.message.includes('Invalid')) {
        res.status(400).json({
          success: false,
          error: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Internal server error'
        });
      }
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: 'Invalid ID format'
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
      console.error('Controller error:', error.message);
      
      res.status(500).json({
        success: false,
        error: 'Internal server error'
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
      console.error('Controller error:', error.message);
      
      res.status(500).json({
        success: false,
        error: 'Internal server error'
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
          error: 'Invalid ID format'
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
      console.error('Controller error:', error.message);
      
      if (error.message.includes('already exists')) {
        res.status(409).json({
          success: false,
          error: error.message
        });
      } else if (error.message.includes('Invalid')) {
        res.status(400).json({
          success: false,
          error: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Internal server error'
        });
      }
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: 'Invalid ID format'
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
      console.error('Controller error:', error.message);
      
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
}
