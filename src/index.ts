import 'reflect-metadata';
import express, { Application } from 'express';
import { Container } from 'inversify';
import { configureContainer } from './config/container';
import { configureUserRoutes } from './presentation/routes/userRoutes';
import { errorHandler, notFoundHandler } from './presentation/middleware/errorHandler';
import { UserController } from './presentation/controllers/UserController';
import { TYPES } from './config/types';

class App {
  private app: Application;
  private container: Container;
  private port: number = 3000;

  constructor() {
    this.app = express();
    this.container = configureContainer();

    this.configureMiddleware();
    this.configureRoutes();
    this.configureErrorHandlers();
  }

  private configureMiddleware(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    this.app.use((req, res, next) => {
      console.log(`${req.method} ${req.path}`);
      next();
    });
  }

  private configureRoutes(): void {
    const router = express.Router();

    router.get('/', (req, res) => {
      res.json({
        success: true,
        message: 'API is running',
        timestamp: new Date().toISOString()
      });
    });

    const userController = this.container.get<UserController>(TYPES.UserController);
    configureUserRoutes(router, userController);

    this.app.use('/api', router);
  }

  private configureErrorHandlers(): void {
    this.app.use(notFoundHandler);
    this.app.use(errorHandler);
  }

  start(): void {
    this.app.listen(this.port, () => {
      console.log('API started on port ' + this.port);
      console.log('http://localhost:' + this.port + '/api');
      console.log('');
    });
  }
}

const app = new App();
app.start();

