import { Router, Request, Response } from 'express';
import {
  createAccount,
  getAccountById,
  getAllAccounts,
  getAccountsByUserId,
  deleteAccount
} from './accountService';
import { CreateAccountDto } from './types';

const router = Router();

router.post('/accounts', (req: Request, res: Response) => {
  try {
    const accountData: CreateAccountDto = req.body;
    const newAccount = createAccount(accountData);

    res.status(201).json({
      success: true,
      data: newAccount,
      message: 'Account created successfully'
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message || 'Cannot create account'
    });
  }
});

// Get all accounts
router.get('/accounts', (req: Request, res: Response) => {
  try {
    const accounts = getAllAccounts();

    res.status(200).json({
      success: true,
      data: accounts,
      count: accounts.length
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Could not retrieve accounts'
    });
  }
});

router.get('/accounts/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const account = getAccountById(id);

    if (!account) {
      res.status(404).json({
        success: false,
        error: 'Account not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: account
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Could not retrieve account'
    });
  }
});

router.get('/accounts/user/:userId', (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const accounts = getAccountsByUserId(userId);

    res.status(200).json({
      success: true,
      data: accounts,
      count: accounts.length
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Could not retrieve accounts'
    });
  }
});

router.delete('/accounts/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = deleteAccount(id);

    if (!deleted) {
      res.status(404).json({
        success: false,
        error: 'Account not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Cannot delete account'
    });
  }
});

export default router;

