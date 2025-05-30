import { Request, Response } from 'express';
import { DestinationModel } from '../models/destination';
import { AccountModel } from '../models/account';
import { ApiResponse } from '../types';

export class DestinationController {
  private destinationModel: DestinationModel;
  private accountModel: AccountModel;

  constructor() {
    this.destinationModel = new DestinationModel();
    this.accountModel = new AccountModel();
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { accountId, url, httpMethod, headers } = req.body;

      if (!accountId || !url || !httpMethod || !headers) {
        res.status(400).json({
          success: false,
          message: 'Account ID, URL, HTTP method, and headers are required fields'
        } as ApiResponse);
        return;
      }

      // Check if account exists
      const account = await this.accountModel.findById(accountId);
      if (!account) {
        res.status(404).json({
          success: false,
          message: 'Account not found'
        } as ApiResponse);
        return;
      }
      const destination = await this.destinationModel.create({
        accountId,
        url,
        httpMethod: httpMethod.toUpperCase(),
        headers
      });

      res.status(201).json({
        success: true,
        message: 'Destination created successfully',
        data: destination
      } as ApiResponse);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to create destination',
        error: error.message
      } as ApiResponse);
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const destinations = await this.destinationModel.findAll();
      res.json({
        success: true,
        message: 'Destinations retrieved successfully',
        data: destinations
      } as ApiResponse);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve destinations',
        error: error.message
      } as ApiResponse);
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const destination = await this.destinationModel.findById(parseInt(id));

      if (!destination) {
        res.status(404).json({
          success: false,
          message: 'Destination not found'
        } as ApiResponse);
        return;
      }

      res.json({
        success: true,
        message: 'Destination retrieved successfully',
        data: destination
      } as ApiResponse);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve destination',
        error: error.message
      } as ApiResponse);
    }
  }

  async getByAccountId(req: Request, res: Response): Promise<void> {
    try {
      const { accountId } = req.params;
      
      // Check if account exists
      const account = await this.accountModel.findById(accountId);
      if (!account) {
        res.status(404).json({
          success: false,
          message: 'Account not found'
        } as ApiResponse);
        return;
      }

      const destinations = await this.destinationModel.findByAccountId(accountId);
      res.json({
        success: true,
        message: 'Destinations retrieved successfully',
        data: destinations
      } as ApiResponse);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve destinations',
        error: error.message
      } as ApiResponse);
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (updateData.httpMethod) {
        updateData.httpMethod = updateData.httpMethod.toUpperCase();
      }

      const destination = await this.destinationModel.update(parseInt(id), updateData);

      if (!destination) {
        res.status(404).json({
          success: false,
          message: 'Destination not found'
        } as ApiResponse);
        return;
      }

      res.json({
        success: true,
        message: 'Destination updated successfully',
        data: destination
      } as ApiResponse);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to update destination',
        error: error.message
      } as ApiResponse);
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await this.destinationModel.delete(parseInt(id));

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Destination not found'
        } as ApiResponse);
        return;
      }

      res.json({
        success: true,
        message: 'Destination deleted successfully'
      } as ApiResponse);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete destination',
        error: error.message
      } as ApiResponse);
    }
  }
}
