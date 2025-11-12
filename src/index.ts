import express, { Application } from 'express';
import { setupUserRoutes } from './adapters/presentation/routes/userRoutes';
import { errorHandler, notFoundHandler } from './adapters/presentation/middleware/errorHandler';

class App {
  private app: Application;
  private port: number = 3000;

  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandlers();
  }

  private setupMiddleware(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    this.app.use((req, res, next) => {
      console.log(`${req.method} ${req.path}`);
      next();
    });
  }

  private setupRoutes(): void {
    const router = express.Router();

    router.get('/api', (req, res) => {
      res.json({
        success: true,
        message: 'API is running',
        timestamp: new Date().toISOString()
      });
    });

    setupUserRoutes(router);

    this.app.use('/api', router);
  }

  private setupErrorHandlers(): void {
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
