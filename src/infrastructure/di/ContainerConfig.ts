import { Container } from './Container';
import { IUserRepository } from '../../domain/ports/IUserRepository';
import { UserRepository } from '../../adapters/persistence/UserRepository';
import { CreateUser } from '../../application/use-cases/CreateUser';
import { GetUser } from '../../application/use-cases/GetUser';
import { GetAllUsers } from '../../application/use-cases/GetAllUsers';
import { UpdateUser } from '../../application/use-cases/UpdateUser';
import { DeleteUser } from '../../application/use-cases/DeleteUser';
import { UserController } from '../../adapters/presentation/controllers/UserController';

export function configureContainer(): Container {
  const container = new Container();

  console.log('=== Configuring IoC Container ===');

  container.register(
    'IUserRepository',
    () => new UserRepository(),
    'singleton'
  );

  container.register(
    'CreateUser',
    () => {
      const repo = container.resolve<IUserRepository>('IUserRepository');
      return new CreateUser(repo);
    },
    'scoped'
  );

  container.register(
    'GetUser',
    () => {
      const repo = container.resolve<IUserRepository>('IUserRepository');
      return new GetUser(repo);
    },
    'scoped'
  );

  container.register(
    'GetAllUsers',
    () => {
      const repo = container.resolve<IUserRepository>('IUserRepository');
      return new GetAllUsers(repo);
    },
    'scoped'
  );

  container.register(
    'UpdateUser',
    () => {
      const repo = container.resolve<IUserRepository>('IUserRepository');
      return new UpdateUser(repo);
    },
    'scoped'
  );

  container.register(
    'DeleteUser',
    () => {
      const repo = container.resolve<IUserRepository>('IUserRepository');
      return new DeleteUser(repo);
    },
    'scoped'
  );

  container.register(
    'UserController',
    () => {
      const createUser = container.resolve<CreateUser>('CreateUser');
      const getUser = container.resolve<GetUser>('GetUser');
      const getAllUsers = container.resolve<GetAllUsers>('GetAllUsers');
      const updateUser = container.resolve<UpdateUser>('UpdateUser');
      const deleteUser = container.resolve<DeleteUser>('DeleteUser');

      return new UserController(
        createUser,
        getUser,
        getAllUsers,
        updateUser,
        deleteUser
      );
    },
    'scoped'
  );

  console.log('=== Container configured ===\n');

  return container;
}

