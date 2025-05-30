import { Request, Response } from 'express';
import { AccountModel } from '../models/account';
import { ApiResponse } from '../types';

export class AccountController {
    private accountModel: AccountModel;

    constructor() {
        this.accountModel = new AccountModel();
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const { email, accountName, website } = req.body;

            if (!email || !accountName) {
                res.status(400).json({
                    success: false,
                    message: 'Email and account name are required fields'
                } as ApiResponse);
                return;
            }

            const account = await this.accountModel.create({
                email,
                accountName,
                website
            });

            res.status(201).json({
                success: true,
                message: 'Account created successfully',
                data: account
            } as ApiResponse);
        } catch (error: any) {
            if (error.message.includes('UNIQUE constraint failed')) {
                res.status(409).json({
                    success: false,
                    message: 'Email already exists'
                } as ApiResponse);
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Failed to create account',
                    error: error.message
                } as ApiResponse);
            }
        }
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const accounts = await this.accountModel.findAll();
            res.json({
                success: true,
                message: 'Accounts retrieved successfully',
                data: accounts
            } as ApiResponse);
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve accounts',
                error: error.message
            } as ApiResponse);
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const { accountId } = req.params;
            const account = await this.accountModel.findById(accountId);

            if (!account) {
                res.status(404).json({
                    success: false,
                    message: 'Account not found'
                } as ApiResponse);
                return;
            }

            res.json({
                success: true,
                message: 'Account retrieved successfully',
                data: account
            } as ApiResponse);
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve account',
                error: error.message
            } as ApiResponse);
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const { accountId } = req.params;
            const updateData = req.body;

            const account = await this.accountModel.update(accountId, updateData);

            if (!account) {
                res.status(404).json({
                    success: false,
                    message: 'Account not found'
                } as ApiResponse);
                return;
            }

            res.json({
                success: true,
                message: 'Account updated successfully',
                data: account
            } as ApiResponse);
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Failed to update account',
                error: error.message
            } as ApiResponse);
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const { accountId } = req.params;
            const deleted = await this.accountModel.delete(accountId);

            if (!deleted) {
                res.status(404).json({
                    success: false,
                    message: 'Account not found'
                } as ApiResponse);
                return;
            }

            res.json({
                success: true,
                message: 'Account deleted successfully'
            } as ApiResponse);
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Failed to delete account',
                error: error.message
            } as ApiResponse);
        }
    }
}
