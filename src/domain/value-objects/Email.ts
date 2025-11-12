export class Email {
  private value: string;

  constructor(email: string) {
    if (!email || email.trim() === '') {
      throw new Error('Email cannot be empty');
    }

    if (!email.includes('@')) {
      throw new Error('Invalid email format');
    }

    if (!email.includes('.')) {
      throw new Error('Invalid email format');
    }

    this.value = email;
  }

  getValue(): string {
    return this.value;
  }

  getDomain(): string {
    const parts = this.value.split('@');
    return parts[1];
  }
}
