import express, { Application, Request, Response } from 'express';
import accountRoutes from './accountRoutes';
import { errorHandler, notFoundHandler } from './errorHandler';

class App {
  private app: Application;
  private port: number = 3001;

  constructor() {
    this.app = express();
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

    router.get('/', (req: Request, res: Response) => {
      res.json({
        success: true,
        message: 'Account Service API is running',
        service: 'Bank Account Service',
        version: '1.0.0',
        timestamp: new Date().toISOString()
      });
    });

    router.use(accountRoutes);

    this.app.use('/api', router);
  }

  private configureErrorHandlers(): void {
    this.app.use(notFoundHandler);
    this.app.use(errorHandler);
  }

  start(): void {
    this.app.listen(this.port, () => {
      console.log(`Port: ${this.port}`);
      console.log(`Account Service is running on http://localhost:${this.port}/api`);
    });
  }
}

const app = new App();
app.start();
