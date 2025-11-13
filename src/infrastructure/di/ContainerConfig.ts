import { Container } from './Container';
import { IUserRepository } from '../../domain/ports/IUserRepository';
import { UserRepository } from '../../adapters/persistence/UserRepository';
import { CommandBus } from '../../application/commands/CommandBus';
import { QueryBus } from '../../application/queries/QueryBus';
import { CreateUserHandler } from '../../application/commands/CreateUserCommand';
import { UpdateUserHandler } from '../../application/commands/UpdateUserCommand';
import { DeleteUserHandler } from '../../application/commands/DeleteUserCommand';
import { GetUserHandler } from '../../application/queries/GetUserQuery';
import { GetAllUsersHandler } from '../../application/queries/GetAllUsersQuery';
import { UserController } from '../../adapters/presentation/controllers/UserController';

export function configureContainer(): Container {
  const container = new Container();

  container.register(
    'IUserRepository',
    () => new UserRepository(),
    'singleton'
  );

  container.register(
    'CommandBus',
    () => {
      const commandBus = new CommandBus();
      const repo = container.resolve<IUserRepository>('IUserRepository');
      
      commandBus.register('CreateUser', new CreateUserHandler(repo));
      commandBus.register('UpdateUser', new UpdateUserHandler(repo));
      commandBus.register('DeleteUser', new DeleteUserHandler(repo));
      
      return commandBus;
    },
    'singleton'
  );

  container.register(
    'QueryBus',
    () => {
      const queryBus = new QueryBus();
      const repo = container.resolve<IUserRepository>('IUserRepository');
      
      queryBus.register('GetUser', new GetUserHandler(repo));
      queryBus.register('GetAllUsers', new GetAllUsersHandler(repo));
      
      return queryBus;
    },
    'singleton'
  );

  container.register(
    'UserController',
    () => {
      const commandBus = container.resolve<CommandBus>('CommandBus');
      const queryBus = container.resolve<QueryBus>('QueryBus');

      return new UserController(commandBus, queryBus);
    },
    'scoped'
  );

  return container;
}
