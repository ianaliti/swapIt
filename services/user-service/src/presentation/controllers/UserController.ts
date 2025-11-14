import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { IUserService } from '../../application/services/IUserService';
import { CreateUserDto, UpdateUserDto } from '../../application/dtos/UserDto';
import { TYPES } from '../../config/types';

@injectable()
export class UserController {
  constructor(
    @inject(TYPES.IUserService) private userService: IUserService
  ) {}

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const userData: CreateUserDto = req.body;
      const newUser = await this.userService.createUser(userData);

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

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: 'ID invalide'
        });
        return;
      }

      const user = await this.userService.getUserById(id);

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

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.userService.getAllUsers();

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

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const userData: UpdateUserDto = req.body;

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: 'ID invalide'
        });
        return;
      }

      const updatedUser = await this.userService.updateUser(id, userData);

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

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: 'ID invalide'
        });
        return;
      }

      const deleted = await this.userService.deleteUser(id);

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
