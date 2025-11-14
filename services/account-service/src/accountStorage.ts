import { Account } from './types';

class AccountStorage {
  private accounts: Map<string, Account> = new Map();

  create(account: Account): Account {
    this.accounts.set(account.accountId, account);
    return account;
  }

  findById(accountId: string): Account | undefined {
    return this.accounts.get(accountId);
  }

  findAll(): Account[] {
    return Array.from(this.accounts.values());
  }

  findByUserId(userId: string): Account[] {
    return Array.from(this.accounts.values()).filter(
      account => account.userId === userId
    );
  }

  update(account: Account): Account {
    this.accounts.set(account.accountId, account);
    return account;
  }

  delete(accountId: string): boolean {
    return this.accounts.delete(accountId);
  }
}

export const accountStorage = new AccountStorage();

