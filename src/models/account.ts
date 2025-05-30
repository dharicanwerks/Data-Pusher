import { Database } from 'sqlite3';
import { Account } from '../types';
import DatabaseManager from '../database/database';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

export class AccountModel {
  private db: Database;

  constructor() {
    this.db = DatabaseManager.getDatabase();
  }

  async create(accountData: Omit<Account, 'id' | 'accountId' | 'appSecretToken' | 'createdAt' | 'updatedAt'>): Promise<Account> {
    return new Promise((resolve, reject) => {
      const accountId = uuidv4();
      const appSecretToken = crypto.randomBytes(32).toString('hex');
      
      const sql = `
        INSERT INTO accounts (accountId, email, accountName, appSecretToken, website)
        VALUES (?, ?, ?, ?, ?)
      `;

      this.db.run(sql, [accountId, accountData.email, accountData.accountName, appSecretToken, accountData.website], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            id: this.lastID,
            accountId,
            email: accountData.email,
            accountName: accountData.accountName,
            appSecretToken,
            website: accountData.website
          });
        }
      });
    });
  }

  async findAll(): Promise<Account[]> {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM accounts ORDER BY createdAt DESC';
      this.db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as Account[]);
        }
      });
    });
  }

  async findById(accountId: string): Promise<Account | null> {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM accounts WHERE id = ?';
      this.db.get(sql, [accountId], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row as Account || null);
        }
      });
    });
  }

  async findByToken(appSecretToken: string): Promise<Account | null> {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM accounts WHERE appSecretToken = ?';
      this.db.get(sql, [appSecretToken], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row as Account || null);
        }
      });
    });
  }

  async update(accountId: string, updateData: Partial<Account>): Promise<Account | null> {
    return new Promise((resolve, reject) => {
      const fields = [];
      const values = [];

      if (updateData.email) {
        fields.push('email = ?');
        values.push(updateData.email);
      }
      if (updateData.accountName) {
        fields.push('accountName = ?');
        values.push(updateData.accountName);
      }
      if (updateData.website !== undefined) {
        fields.push('website = ?');
        values.push(updateData.website);
      }

      fields.push('updatedAt = CURRENT_TIMESTAMP');
      values.push(accountId);

      const sql = `UPDATE accounts SET ${fields.join(', ')} WHERE id = ?`;

      this.db.run(sql, values, (err) => {
        if (err) {
          reject(err);
        } else {
          this.findById(accountId).then(resolve).catch(reject);
        }
      });
    });
  }

  async delete(accountId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM accounts WHERE id = ?';
      this.db.run(sql, [accountId], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }
}
