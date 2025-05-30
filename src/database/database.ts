
// src/database/database.ts
import sqlite3 from 'sqlite3';
import { Database } from 'sqlite3';
import path from 'path';

class DatabaseManager {
  private db: Database;

  constructor() {
    const dbPath = path.join(__dirname, '../../data.db');
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
      } else {
        console.log('Connected to SQLite database');
        this.initializeTables();
      }
    });
  }

  private initializeTables(): void {
    // Create accounts table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS accounts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        accountId TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        accountName TEXT NOT NULL,
        appSecretToken TEXT UNIQUE NOT NULL,
        website TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create destinations table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS destinations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        accountId INTEGER NOT NULL,
        url TEXT NOT NULL,
        httpMethod TEXT NOT NULL,
        headers TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (accountId) REFERENCES accounts (id) ON DELETE CASCADE
      )
    `);

    // Enable foreign key constraints
    this.db.run('PRAGMA foreign_keys = ON');
  }

  getDatabase(): Database {
    return this.db;
  }

  close(): void {
    this.db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
      } else {
        console.log('Database connection closed');
      }
    });
  }
}

export default new DatabaseManager();