import axios, { AxiosInstance } from 'axios';

export class AccountServiceClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor(accountServiceURL: string = 'http://localhost:3001/api') {
    this.baseURL = accountServiceURL;
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 5000, 
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async createAccount(userId: string, currency: string = 'EUR'): Promise<any> {
    try {
      const response = await this.client.post('/accounts', {
        userId,
        currency
      });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Account Service is unavailable';
      throw new Error(errorMessage);
    }
  }

  async getAccountsByUserId(userId: string): Promise<any[]> {
    try {
      const response = await this.client.get(`/accounts/user/${userId}`);
      return response.data.data || [];
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Account Service is unavailable';
      throw new Error(errorMessage);
    }
  }

  async deleteAccount(accountId: string): Promise<boolean> {
    try {
      const response = await this.client.delete(`/accounts/${accountId}`);
      return response.data.success === true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Account Service is unavailable';
      throw new Error(errorMessage);
    }
  }

  async deleteAllAccountsByUserId(userId: string): Promise<void> {
    try {
      const accounts = await this.getAccountsByUserId(userId);

      const deletePromises = accounts.map((account: any) => 
        this.deleteAccount(account.accountId)
      );

      await Promise.all(deletePromises);
    } catch (error: any) {
      throw new Error(`Failed to delete user accounts: ${error.message}`);
    }
  }
}

