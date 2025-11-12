import { User, UserProfile } from '../entities/User';

describe('User', () => {
  test('create user with company email', () => {
    const user = new User(
      1,
      'Dupont',
      'Marie',
      'marie@company.com',
      '0612345678'
    );

    expect(user.id).toBe(1);
    expect(user.nom).toBe('Dupont');
    expect(user.getEmail()).toBe('marie@company.com');
    expect(user.getProfil()).toBe(UserProfile.ADMINISTRATEUR);
  });

  test('create user with gmail', () => {
    const user = new User(
      2,
      'Martin',
      'Jean',
      'jean@gmail.com',
      '0698765432'
    );

    expect(user.getProfil()).toBe(UserProfile.UTILISATEUR);
  });

  test('empty name throws error', () => {
    expect(() => 
      new User(1, '', 'Jean', 'jean@test.com', '0612345678')
    ).toThrow('Name cannot be empty');
  });

  test('change email changes profile', () => {
    const user = new User(
      1,
      'Martin',
      'Jean',
      'jean@gmail.com',
      '0612345678'
    );

    expect(user.getProfil()).toBe(UserProfile.UTILISATEUR);

    user.changeEmail('jean@company.com');

    expect(user.getEmail()).toBe('jean@company.com');
    expect(user.getProfil()).toBe(UserProfile.ADMINISTRATEUR);
  });

  test('isAdmin returns true for admin', () => {
    const user = new User(
      1,
      'Admin',
      'User',
      'admin@company.com',
      '0612345678'
    );

    expect(user.isAdmin()).toBe(true);
  });

  test('isAdmin returns false for normal user', () => {
    const user = new User(
      1,
      'User',
      'Normal',
      'user@gmail.com',
      '0612345678'
    );

    expect(user.isAdmin()).toBe(false);
  });
});
