export interface Account {
  accountId: string;
  userId: string;
  accountNumber: string;
  balance: number;
  currency: string;
  status: 'active' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAccountDto {
  userId: string;
  currency?: string;
}

