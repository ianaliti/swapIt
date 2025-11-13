import { Request, Response } from 'express';
import { CommandBus } from '../../../application/commands/CommandBus';
import { QueryBus } from '../../../application/queries/QueryBus';
import { CreateUserCommand } from '../../../application/commands/CreateUserCommand';
import { UpdateUserCommand } from '../../../application/commands/UpdateUserCommand';
import { DeleteUserCommand } from '../../../application/commands/DeleteUserCommand';
import { GetUserQuery } from '../../../application/queries/GetUserQuery';
import { GetAllUsersQuery } from '../../../application/queries/GetAllUsersQuery';
import { CreateUserDto, UpdateUserDto } from '../../../application/dtos/UserDto';

export class UserController {
  commandBus: CommandBus;
  queryBus: QueryBus;

  constructor(commandBus: CommandBus, queryBus: QueryBus) {
    this.commandBus = commandBus;
    this.queryBus = queryBus;
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      console.log('Controller: Creating user');
      
      const userData: CreateUserDto = req.body;
      const command = new CreateUserCommand(userData);
      
      const newUser = await this.commandBus.execute('CreateUser', command);

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

      const query = new GetUserQuery(id);
      const user = await this.queryBus.execute('GetUser', query);

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
      const query = new GetAllUsersQuery();
      const users = await this.queryBus.execute('GetAllUsers', query);

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

      const command = new UpdateUserCommand(id, userData);
      const updatedUser = await this.commandBus.execute('UpdateUser', command);

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

      const command = new DeleteUserCommand(id);
      const deleted = await this.commandBus.execute('DeleteUser', command);

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
