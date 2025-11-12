import { Container } from 'inversify';
import 'reflect-metadata';
import { TYPES } from './types';
import { IUserService } from '../application/services/IUserService';
import { IUserRepository } from '../domain/repositories/IUserRepository';
import { UserService } from '../application/services/UserService';
import { UserRepository } from '../infrastructure/repositories/UserRepository';
import { UserController } from '../presentation/controllers/UserController';

export function configureContainer(): Container {
  const container = new Container();

  container.bind<IUserRepository>(TYPES.IUserRepository)
    .to(UserRepository)
    .inSingletonScope();

  container.bind<IUserService>(TYPES.IUserService)
    .to(UserService)
    .inRequestScope();

  container.bind<UserController>(TYPES.UserController)
    .to(UserController)
    .inRequestScope();

  return container;
}

