import { Account, CreateAccountDto } from './types';
import { accountStorage } from './accountStorage';

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function generateAccountNumber(): string {
  const timestamp = Date.now().toString().slice(-10);
  return `ACC-${timestamp}`;
}

export function createAccount(data: CreateAccountDto): Account {
  if (!data.userId || data.userId.trim() === '') {
    throw new Error('userId is required');
  }

  const now = new Date();
  const account: Account = {
    accountId: generateUUID(),
    userId: data.userId,
    accountNumber: generateAccountNumber(),
    balance: 0,
    currency: data.currency || 'EUR',
    status: 'active',
    createdAt: now,
    updatedAt: now
  };

  return accountStorage.create(account);
}

export function getAccountById(accountId: string): Account | undefined {
  return accountStorage.findById(accountId);
}

export function getAllAccounts(): Account[] {
  return accountStorage.findAll();
}

export function getAccountsByUserId(userId: string): Account[] {
  return accountStorage.findByUserId(userId);
}

export function deleteAccount(accountId: string): boolean {
  return accountStorage.delete(accountId);
}

