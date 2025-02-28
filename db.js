const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

console.log('Starting database initialization...');

// Ensure the data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Create or open the SQLite database
const dbPath = path.join(dataDir, 'dokoexp.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    initDb();
  }
});

// Initialize the database tables
function initDb() {
  console.log('Creating database tables...');

  db.serialize(() => {
    // Table for storing the complete JSON dumps
    db.run(`CREATE TABLE IF NOT EXISTS dumps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      filename TEXT,
      content BLOB
    )`);

    // Table for Spiel data
    db.run(`CREATE TABLE IF NOT EXISTS spiel (
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
    db.run(`CREATE TABLE IF NOT EXISTS spielrunde (
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
    db.run(`CREATE TABLE IF NOT EXISTS spieler (
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
  });
}

console.log('Database module initialized.');

module.exports = db; 