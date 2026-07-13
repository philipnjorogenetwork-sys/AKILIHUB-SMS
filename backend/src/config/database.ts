import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import Database from "better-sqlite3";

dotenv.config();

const dbPath = process.env.DB_PATH || path.join(process.cwd(), "akilihub.sqlite");

const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const database = new Database(dbPath);
database.pragma("journal_mode = WAL");

database.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    person_id TEXT,
    phone TEXT,
    address TEXT,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME
  );

  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    person_id INTEGER,
    school_code TEXT NOT NULL,
    admission_no TEXT NOT NULL UNIQUE,
    grade_level TEXT,
    section TEXT,
    parent_id INTEGER,
    status TEXT DEFAULT 'Active',
    fee_balance REAL DEFAULT 0,
    fee_paid REAL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS credentials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    person_id TEXT NOT NULL,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    password TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

export function getConnection() {
  return database;
}

export function executeQuery<T>(query: string, values: any[] = []): T[] {
  const statement = database.prepare(query);
  return statement.all(...values) as T[];
}

export function executeQueryOne<T>(query: string, values: any[] = []): T | null {
  const statement = database.prepare(query);
  return (statement.get(...values) as T | null) ?? null;
}

export function executeUpdate(query: string, values: any[] = []): { affectedRows: number; lastInsertId: number } {
  const statement = database.prepare(query);
  const info = statement.run(...values) as { changes: number; lastInsertRowid: number };
  return { affectedRows: info.changes, lastInsertId: info.lastInsertRowid };
}

export async function closePool(): Promise<void> {
  database.close();
}

export async function startTransaction() {
  return database.transaction((callback: () => void) => callback());
}

export function getPoolStats() {
  return {
    connectionLimit: 1,
    queueLimit: 0,
    activeConnections: 1,
    idleConnections: 1,
    waitingQueue: 0,
  };
}

export default database;
