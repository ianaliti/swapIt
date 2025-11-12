import { Container } from 'inversify';
import 'reflect-metadata';
import { TYPES } from './types';

import { IUserRepository } from '../domain/ports/IUserRepository';
import { UserRepository } from '../adapters/persistence/UserRepository';

import { CreateUser } from '../application/use-cases/CreateUser';
import { GetUser } from '../application/use-cases/GetUser';
import { GetAllUsers } from '../application/use-cases/GetAllUsers';
import { UpdateUser } from '../application/use-cases/UpdateUser';
import { DeleteUser } from '../application/use-cases/DeleteUser';

import { UserController } from '../adapters/presentation/controllers/UserController';

export function configureContainer(): Container {
  const container = new Container();

  container.bind<IUserRepository>(TYPES.IUserRepository)
    .to(UserRepository)
    .inSingletonScope();

  container.bind<CreateUser>(TYPES.CreateUser).to(CreateUser);
  container.bind<GetUser>(TYPES.GetUser).to(GetUser);
  container.bind<GetAllUsers>(TYPES.GetAllUsers).to(GetAllUsers);
  container.bind<UpdateUser>(TYPES.UpdateUser).to(UpdateUser);
  container.bind<DeleteUser>(TYPES.DeleteUser).to(DeleteUser);

  container.bind<UserController>(TYPES.UserController)
    .to(UserController)
    .inRequestScope();

  return container;
}
