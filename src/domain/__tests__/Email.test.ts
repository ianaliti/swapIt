import { Email } from '../value-objects/Email';

describe('Email', () => {
  test('create valid email', () => {
    const email = new Email('test@example.com');
    
    expect(email.getValue()).toBe('test@example.com');
  });

  test('get domain from email', () => {
    const email = new Email('user@company.com');
    
    expect(email.getDomain()).toBe('company.com');
  });

  test('empty email throws error', () => {
    expect(() => new Email('')).toThrow('Email cannot be empty');
  });

  test('email without @ throws error', () => {
    expect(() => new Email('invalid')).toThrow('Invalid email format');
  });

  test('email without dot throws error', () => {
    expect(() => new Email('test@example')).toThrow('Invalid email format');
  });
});
