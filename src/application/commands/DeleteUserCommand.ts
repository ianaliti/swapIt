import { ICommand, ICommandHandler } from './ICommand';
import { IUserRepository } from '../../domain/ports/IUserRepository';

export class DeleteUserCommand implements ICommand<boolean> {
  constructor(public id: number) {}
}

export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand, boolean> {
  userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async handle(command: DeleteUserCommand): Promise<boolean> {
    console.log('Deleting user:', command.id);
    return this.userRepository.delete(command.id);
  }
}

