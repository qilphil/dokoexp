import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Starting database initialization...');

// Ensure the data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Database path
const dbPath = path.join(dataDir, 'dokoexp.db');

// Create a database connection wrapper with promise-based methods
const dbPromise = (async () => {
  try {
    // Open database connection
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    console.log('Connected to the SQLite database.');

    // Initialize database tables
    await initDb(db);

    return db;
  } catch (err) {
    console.error('Error opening database:', err.message);
    throw err;
  }
})();

// Initialize the database tables
async function initDb(db) {
  console.log('Creating database tables...');

  // Table for storing the complete JSON dumps
  await db.exec(`CREATE TABLE IF NOT EXISTS dumps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    filename TEXT,
    content BLOB
  )`);

  // Table for Spiel data
  await db.exec(`CREATE TABLE IF NOT EXISTS spiel (
    id INTEGER,
    dump_id INTEGER,
    mandantId INTEGER,
    geber INTEGER,
    spielorder INTEGER,
    score INTEGER,
    hasWon TEXT,
    data TEXT,
    startTime TEXT,
    endTime TEXT,
    solo INTEGER,
    spielrunde INTEGER,
    PRIMARY KEY (id, dump_id),
    FOREIGN KEY (dump_id) REFERENCES dumps(id)
  )`);

  // Table for Spielrunde data
  await db.exec(`CREATE TABLE IF NOT EXISTS spielrunde (
    id INTEGER,
    dump_id INTEGER,
    mandantId INTEGER,
    startTime TEXT,
    endTime TEXT,
    finished INTEGER,
    comment TEXT,
    spieler TEXT,
    spiele TEXT,
    numSpiele INTEGER,
    summen TEXT,
    data TEXT,
    PRIMARY KEY (id, dump_id),
    FOREIGN KEY (dump_id) REFERENCES dumps(id)
  )`);

  // Table for Spieler data
  await db.exec(`CREATE TABLE IF NOT EXISTS spieler (
    id INTEGER,
    dump_id INTEGER,
    mandantId INTEGER,
    name TEXT,
    kurzName TEXT,
    initials TEXT,
    data TEXT,
    PRIMARY KEY (id, dump_id),
    FOREIGN KEY (dump_id) REFERENCES dumps(id)
  )`);
}

console.log('Database module initialized.');

export default dbPromise; 