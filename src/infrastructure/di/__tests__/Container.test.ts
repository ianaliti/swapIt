import { Container } from '../Container';

describe('IoC Container', () => {
  test('should register and resolve singleton', () => {
    const container = new Container();
    
    let counter = 0;
    container.register('Counter', () => {
      counter++;
      return { count: counter };
    }, 'singleton');

    const instance1 = container.resolve('Counter');
    const instance2 = container.resolve('Counter');

    expect(instance1).toBe(instance2);
    expect(counter).toBe(1);
  });

  test('should register and resolve transient', () => {
    const container = new Container();
    
    let counter = 0;
    container.register('Counter', () => {
      counter++;
      return { count: counter };
    }, 'transient');

    const instance1 = container.resolve('Counter');
    const instance2 = container.resolve('Counter');

    expect(instance1).not.toBe(instance2);
    expect(counter).toBe(2);
  });

  test('should register and resolve scoped', () => {
    const container = new Container();
    
    let counter = 0;
    container.register('Counter', () => {
      counter++;
      return { count: counter };
    }, 'scoped');

    const instance1 = container.resolve('Counter');
    const instance2 = container.resolve('Counter');

    expect(instance1).toBe(instance2);
    expect(counter).toBe(1);

    container.resetScoped();

    const instance3 = container.resolve('Counter');
    
    expect(instance3).not.toBe(instance1);
    expect(counter).toBe(2);
  });

  test('should throw error when resolving unregistered service', () => {
    const container = new Container();

    expect(() => container.resolve('Unknown')).toThrow('No registration found for: Unknown');
  });

  test('should resolve dependencies', () => {
    const container = new Container();

    container.register('Database', () => ({ name: 'TestDB' }), 'singleton');
    
    container.register('Repository', () => {
      const db = container.resolve('Database');
      return { db, getData: () => 'data' };
    }, 'scoped');

    const repo1 = container.resolve<any>('Repository');
    const repo2 = container.resolve<any>('Repository');

    expect(repo1).toBe(repo2);
    expect(repo1.db.name).toBe('TestDB');
  });
});

