import { ICommandHandler } from './ICommand';

export class CommandBus {
  private handlers: Map<string, any> = new Map();

  register(commandName: string, handler: any): void {
    this.handlers.set(commandName, handler);
  }

  async execute(commandName: string, command: any): Promise<any> {
    const handler = this.handlers.get(commandName);
    
    if (!handler) {
      throw new Error(`No handler for command: ${commandName}`);
    }

    return handler.handle(command);
  }
}

