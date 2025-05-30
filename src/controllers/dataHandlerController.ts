import { Request, Response } from 'express';
import { AccountModel } from '../models/account';
import { DestinationModel } from '../models/destination';
import { ApiResponse, IncomingDataRequest } from '../types';
import axios from 'axios';

export class DataHandlerController {
  private accountModel: AccountModel;
  private destinationModel: DestinationModel;

  constructor() {
    this.accountModel = new AccountModel();
    this.destinationModel = new DestinationModel();
  }

  async handleIncomingData(req: Request, res: Response): Promise<void> {
    try {
      // Check for app secret token in headers
      const appSecretToken = req.headers['cl-x-token'] as string;

      if (!appSecretToken) {
        res.status(401).json({
          success: false,
          message: 'Un Authenticate'
        } as ApiResponse);
        return;
      }

      // Check if request is JSON
      if (req.headers['content-type'] !== 'application/json') {
        res.status(400).json({
          success: false,
          message: 'Invalid Data'
        } as ApiResponse);
        return;
      }

      // Verify token and get account
      const account = await this.accountModel.findByToken(appSecretToken);
      if (!account) {
        res.status(401).json({
          success: false,
          message: 'Un Authenticate'
        } as ApiResponse);
        return;
      }

      // Get destinations for the account
      const destinations = await this.destinationModel.findByAccountId(account.accountId);

      if (destinations.length === 0) {
        res.json({
          success: true,
          message: 'Data received but no destinations configured'
        } as ApiResponse);
        return;
      }

      // Send data to all destinations
      const promises = destinations.map(destination => this.sendToDestination(destination, req.body));
      
      try {
        await Promise.all(promises);
        res.json({
          success: true,
          message: `Data sent to ${destinations.length} destination(s) successfully`
        } as ApiResponse);
      } catch (error: any) {
        res.status(500).json({
          success: false,
          message: 'Failed to send data to some destinations',
          error: error.message
        } as ApiResponse);
      }

    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      } as ApiResponse);
    }
  }

  private async sendToDestination(destination: any, data: IncomingDataRequest): Promise<void> {
    try {
      const { url, httpMethod, headers } = destination;

      if (httpMethod === 'GET') {
        // For GET requests, send JSON data as query parameters
        const queryParams = new URLSearchParams();
        Object.keys(data).forEach(key => {
          queryParams.append(key, JSON.stringify(data[key]));
        });

        await axios.get(`${url}?${queryParams.toString()}`, {
          headers,
          timeout: 10000
        });
      } else {
        // For POST, PUT, DELETE - send data as JSON body
        await axios({
          method: httpMethod.toLowerCase(),
          url,
          data,
          headers: {
            ...headers,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        });
      }
    } catch (error: any) {
      console.error(`Failed to send data to ${destination.url}:`, error.message);
      throw error;
    }
  }
}
