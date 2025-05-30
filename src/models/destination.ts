import { Database } from 'sqlite3';
import { Destination } from '../types';
import DatabaseManager from '../database/database';

export class DestinationModel {
    private db: Database;

    constructor() {
        this.db = DatabaseManager.getDatabase();
    }

    async create(destinationData: Omit<Destination, 'id' | 'createdAt' | 'updatedAt'>): Promise<Destination> {
        return new Promise((resolve, reject) => {
            const sql = `
        INSERT INTO destinations (accountId, url, httpMethod, headers)
        VALUES (?, ?, ?, ?)
      `;

            const headersJson = JSON.stringify(destinationData.headers);

            this.db.run(sql, [destinationData.accountId, destinationData.url, destinationData.httpMethod, headersJson], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        id: this.lastID,
                        ...destinationData
                    });
                }
            });
        });
    }

    async findAll(): Promise<Destination[]> {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM destinations ORDER BY createdAt DESC';
            this.db.all(sql, [], (err, rows: any[]) => {
                if (err) {
                    reject(err);
                } else {
                    const destinations = rows.map(row => ({
                        ...row,
                        headers: JSON.parse(row.headers)
                    }));
                    resolve(destinations as Destination[]);
                }
            });
        });
    }

    async findById(id: number): Promise<Destination | null> {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM destinations WHERE id = ?';
            this.db.get(sql, [id], (err, row: any) => {
                if (err) {
                    reject(err);
                } else if (!row) {
                    resolve(null);
                } else {
                    resolve({
                        ...row,
                        headers: JSON.parse(row.headers)
                    } as Destination);
                }
            });
        });
    }

    async findByAccountId(accountId: Number): Promise<Destination[]> {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM destinations WHERE accountId = ? ORDER BY createdAt DESC';
            this.db.all(sql, [accountId], (err, rows: any[]) => {
                if (err) {
                    reject(err);
                } else {
                    const destinations = rows.map(row => ({
                        ...row,
                        headers: JSON.parse(row.headers)
                    }));
                    resolve(destinations as Destination[]);
                }
            });
        });
    }

    async update(id: number, updateData: Partial<Destination>): Promise<Destination | null> {
        return new Promise((resolve, reject) => {
            const fields = [];
            const values = [];

            if (updateData.url) {
                fields.push('url = ?');
                values.push(updateData.url);
            }
            if (updateData.httpMethod) {
                fields.push('httpMethod = ?');
                values.push(updateData.httpMethod);
            }
            if (updateData.headers) {
                fields.push('headers = ?');
                values.push(JSON.stringify(updateData.headers));
            }

            fields.push('updatedAt = CURRENT_TIMESTAMP');
            values.push(id);

            const sql = `UPDATE destinations SET ${fields.join(', ')} WHERE id = ?`;

            this.db.run(sql, values, (err) => {
                if (err) {
                    reject(err);
                } else {
                    this.findById(id).then(resolve).catch(reject);
                }
            });
        });
    }

    async delete(id: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM destinations WHERE id = ?';
            this.db.run(sql, [id], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.changes > 0);
                }
            });
        });
    }
}
