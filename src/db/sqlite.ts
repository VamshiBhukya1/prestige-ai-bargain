import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';

const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'prestige.db');
export const sqlite = new Database(dbPath);

// Enable WAL mode for high performance local execution
sqlite.pragma('journal_mode = WAL');

// Initialize database schema
export function initSqliteDatabase() {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      full_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'CUSTOMER',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS sessions (
      sid TEXT PRIMARY KEY,
      sess TEXT NOT NULL,
      expired DATETIME NOT NULL
    );
  `);

  // Seed default customer if not present
  const defaultUser = sqlite.prepare('SELECT * FROM users WHERE email = ?').get('customer@demo.com');
  if (!defaultUser) {
    const passwordHash = bcrypt.hashSync('password123', 12);
    sqlite.prepare(`
      INSERT INTO users (id, full_name, email, password_hash, role)
      VALUES (?, ?, ?, ?, ?)
    `).run('user_customer_1', 'Aditi Sharma', 'customer@demo.com', passwordHash, 'CUSTOMER');
    console.log('[SQLite DB] Seeded default customer: customer@demo.com');
  }

  console.log(`[SQLite DB] Database initialized and persisting at: ${dbPath}`);
}

export interface UserRecord {
  id: string;
  full_name: string;
  email: string;
  password_hash: string;
  role: string;
  created_at?: string;
  updated_at?: string;
}

export const sqliteDb = {
  findUserByEmail(email: string): UserRecord | undefined {
    const stmt = sqlite.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email.toLowerCase().trim()) as UserRecord | undefined;
  },

  findUserById(id: string): UserRecord | undefined {
    const stmt = sqlite.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id) as UserRecord | undefined;
  },

  createUser(fullName: string, email: string, passwordHash: string, role = 'CUSTOMER'): UserRecord {
    const id = `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const normalizedEmail = email.toLowerCase().trim();
    sqlite.prepare(`
      INSERT INTO users (id, full_name, email, password_hash, role)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, fullName.trim(), normalizedEmail, passwordHash, role);

    const newUser = this.findUserById(id);
    if (!newUser) throw new Error('Failed to retrieve created user');
    return newUser;
  },
};
