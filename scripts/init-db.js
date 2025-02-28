/**
 * Database initialization script
 * 
 * This script initializes the SQLite database with the required tables
 * for the DokoExp application.
 */

import dbPromise from '../db.js';

const initializeDatabase = async () => {
  try {
    console.log('Starting database initialization...');

    // Get database connection
    const db = await dbPromise;
    console.log('Database connection established.');

    // The database tables are automatically created when the application starts
    // through the db.js module, but we can add additional initialization here if needed

    // Check if tables were created successfully
    const tables = await db.all(`
      SELECT name FROM sqlite_master 
      WHERE type='table' 
      ORDER BY name
    `);

    console.log('Database tables created:');
    tables.forEach(table => console.log(`- ${table.name}`));

    console.log('Database initialization completed successfully.');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

// Run the initialization
initializeDatabase(); 