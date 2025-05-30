
// src/types/index.ts
export interface Account {
    id?: number;
    accountId: string;
    email: string;
    accountName: string;
    appSecretToken: string;
    website?: string;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface Destination {
    id?: number;
    accountId: string;
    url: string;
    httpMethod: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers: Record<string, string>;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
  }
  
  export interface IncomingDataRequest {
    [key: string]: any;
  }