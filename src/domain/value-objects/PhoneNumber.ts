export class PhoneNumber {
  private value: string;

  constructor(phone: string) {
    if (!phone || phone.trim() === '') {
      throw new Error('Phone number cannot be empty');
    }

    this.value = phone;
  }

  getValue(): string {
    return this.value;
  }
}
