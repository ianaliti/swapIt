export type Lifetime = 'singleton' | 'scoped' | 'transient';

interface Registration {
  factory: () => any;
  lifetime: Lifetime;
  instance?: any;
}

export class Container {
  private registrations: Map<string, Registration>;

  constructor() {
    this.registrations = new Map();
  }

  register(key: string, factory: () => any, lifetime: Lifetime = 'transient'): void {
    console.log(`Registering: ${key} (${lifetime})`);
    
    this.registrations.set(key, {
      factory: factory,
      lifetime: lifetime,
      instance: undefined
    });
  }

  resolve<T>(key: string): T {
    const registration = this.registrations.get(key);
    
    if (!registration) {
      throw new Error(`No registration found for: ${key}`);
    }

    if (registration.lifetime === 'singleton') {
      if (!registration.instance) {
        console.log(`Creating singleton instance: ${key}`);
        registration.instance = registration.factory();
      } else {
        console.log(`Reusing singleton instance: ${key}`);
      }
      return registration.instance;
    }

    if (registration.lifetime === 'scoped') {
      if (!registration.instance) {
        console.log(`Creating scoped instance: ${key}`);
        registration.instance = registration.factory();
      } else {
        console.log(`Reusing scoped instance: ${key}`);
      }
      return registration.instance;
    }

    console.log(`Creating transient instance: ${key}`);
    return registration.factory();
  }

  resetScoped(): void {
    console.log('Resetting scoped instances');
    
    for (const registration of this.registrations.values()) {
      if (registration.lifetime === 'scoped') {
        registration.instance = undefined;
      }
    }
  }

  clear(): void {
    console.log('Clearing all registrations');
    this.registrations.clear();
  }
}

