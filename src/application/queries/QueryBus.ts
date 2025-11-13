import { IQueryHandler } from './IQuery';

export class QueryBus {
  private handlers: Map<string, any> = new Map();

  register(queryName: string, handler: any): void {
    this.handlers.set(queryName, handler);
  }

  async execute(queryName: string, query: any): Promise<any> {
    const handler = this.handlers.get(queryName);
    
    if (!handler) {
      throw new Error(`No handler for query: ${queryName}`);
    }

    return handler.handle(query);
  }
}

