import fs from 'fs/promises';
import path from 'path';
import dbPromise from '../db.js';

/**
 * Process JSON data upload
 */
export const uploadJson = async (req, res) => {
  try {
    // Check if we have JSON data in the request body
    if (req.body && (req.body.data || (req.body.Spiel && req.body.Spielrunde && req.body.Spieler))) {
      const jsonData = req.body.data || req.body;
      await processJsonData(jsonData, 'direct-api-upload.json', res);
      return;
    }

    // If no JSON data in body
    res.status(400).json({
      error: 'No JSON data provided in request body. Use the data field or provide Spiel, Spielrunde, and Spieler arrays directly.'
    });
  } catch (error) {
    console.error('Error processing JSON upload:', error);
    res.status(500).json({ error: `Error processing JSON data: ${error.message}` });
  }
};

/**
 * Process file upload
 */
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { path: filePath, originalname: fileName } = req.file;

    // Read the uploaded JSON file
    const data = await fs.readFile(filePath, 'utf8');
    await processJsonData(data, fileName, res);
  } catch (error) {
    console.error('Error processing file upload:', error);
    res.status(500).json({ error: `Error processing file upload: ${error.message}` });
  }
};

/**
 * Get all dumps
 */
export const getAllDumps = async (req, res) => {
  try {
    const db = await dbPromise;
    const dumps = await db.all('SELECT id, timestamp, filename FROM dumps ORDER BY timestamp DESC');
    res.json(dumps);
  } catch (error) {
    console.error('Error fetching dumps:', error);
    res.status(500).json({ error: 'Error fetching dumps' });
  }
};

/**
 * Get a specific dump by ID
 */
export const getDumpById = async (req, res) => {
  try {
    const { id: dumpId } = req.params;
    const db = await dbPromise;

    const dump = await db.get('SELECT id, timestamp, filename, content FROM dumps WHERE id = ?', dumpId);

    if (!dump) {
      return res.status(404).json({ error: 'Dump not found' });
    }

    res.json(dump);
  } catch (error) {
    console.error('Error fetching dump:', error);
    res.status(500).json({ error: `Error fetching dump: ${error.message}` });
  }
};

/**
 * Process the JSON data and store it in the database
 */
async function processJsonData(jsonData, fileName, res) {
  try {
    // Parse the JSON data if it's a string
    const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;

    // Validate the data structure
    if (!data.Spiel || !data.Spielrunde || !data.Spieler) {
      return res.status(400).json({ error: 'Invalid JSON structure. Expected Spiel, Spielrunde, and Spieler arrays.' });
    }

    const db = await dbPromise;

    // Store the JSON blob in the dumps table
    const result = await db.run(
      'INSERT INTO dumps (filename, content) VALUES (?, ?)',
      [fileName, JSON.stringify(data)]
    );

    const dumpId = result.lastID;

    // Insert data into the respective tables
    await insertSpielData(data.Spiel, dumpId, db);
    await insertSpielrundeData(data.Spielrunde, dumpId, db);
    await insertSpielerData(data.Spieler, dumpId, db);

    res.status(201).json({
      message: 'Database dump processed successfully',
      dumpId
    });
  } catch (error) {
    console.error('Error processing JSON data:', error);
    res.status(400).json({ error: `Invalid JSON data: ${error.message}` });
  }
}

/**
 * Insert Spiel data into the spiel table
 */
async function insertSpielData(spielArray, dumpId, db) {
  const stmt = await db.prepare(`
    INSERT INTO spiel (
      id, dump_id, mandantId, geber, spielorder, score, 
      hasWon, data, startTime, endTime, solo, spielrunde
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const spiel of spielArray) {
    const {
      id, mandantId, geber, spielorder, score,
      hasWon, data, startTime, endTime, solo, spielrunde
    } = spiel;

    await stmt.run(
      id, dumpId, mandantId, geber, spielorder, score,
      hasWon, data, startTime, endTime, solo, spielrunde
    );
  }

  await stmt.finalize();
}

/**
 * Insert Spielrunde data into the spielrunde table
 */
async function insertSpielrundeData(spielrundeArray, dumpId, db) {
  const stmt = await db.prepare(`
    INSERT INTO spielrunde (
      id, dump_id, mandantId, startTime, endTime, finished,
      comment, spieler, spiele, numSpiele, summen, data
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const spielrunde of spielrundeArray) {
    const {
      id, mandantId, startTime, endTime, finished,
      comment, spieler, spiele, numSpiele, summen, data
    } = spielrunde;

    await stmt.run(
      id, dumpId, mandantId, startTime, endTime, finished,
      comment, spieler, spiele, numSpiele, summen, data
    );
  }

  await stmt.finalize();
}

/**
 * Insert Spieler data into the spieler table
 */
async function insertSpielerData(spielerArray, dumpId, db) {
  const stmt = await db.prepare(`
    INSERT INTO spieler (
      id, dump_id, mandantId, name, kurzName, initials, data
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  for (const spieler of spielerArray) {
    const { id, mandantId, name, kurzName, initials, data } = spieler;

    await stmt.run(
      id, dumpId, mandantId, name, kurzName, initials, data
    );
  }

  await stmt.finalize();
} 