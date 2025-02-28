const fs = require('fs');
const path = require('path');
const db = require('../db');

/**
 * Process JSON data upload
 */
exports.uploadJson = (req, res) => {
  try {
    // Check if we have JSON data in the request body
    if (req.body && (req.body.data || (req.body.Spiel && req.body.Spielrunde && req.body.Spieler))) {
      const jsonData = req.body.data || req.body;
      processJsonData(jsonData, 'direct-api-upload.json', res);
      return;
    }

    // If no JSON data in body
    res.status(400).json({ error: 'No JSON data provided in request body. Use the data field or provide Spiel, Spielrunde, and Spieler arrays directly.' });
  } catch (error) {
    console.error('Error processing JSON upload:', error);
    res.status(500).json({ error: 'Error processing JSON data: ' + error.message });
  }
};

/**
 * Process file upload
 */
exports.uploadFile = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileName = req.file.originalname;

    // Read the uploaded JSON file
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading file:', err);
        return res.status(500).json({ error: 'Error reading uploaded file' });
      }

      processJsonData(data, fileName, res);
    });
  } catch (error) {
    console.error('Error processing file upload:', error);
    res.status(500).json({ error: 'Error processing file upload: ' + error.message });
  }
};

/**
 * Get all dumps
 */
exports.getAllDumps = (req, res) => {
  db.all('SELECT id, timestamp, filename FROM dumps ORDER BY timestamp DESC', (err, dumps) => {
    if (err) {
      console.error('Error fetching dumps:', err);
      return res.status(500).json({ error: 'Error fetching dumps' });
    }
    res.json(dumps);
  });
};

/**
 * Get a specific dump by ID
 */
exports.getDumpById = (req, res) => {
  const dumpId = req.params.id;

  db.get('SELECT id, timestamp, filename, content FROM dumps WHERE id = ?', [dumpId], (err, dump) => {
    if (err) {
      console.error('Error fetching dump:', err);
      return res.status(500).json({ error: 'Error fetching dump' });
    }

    if (!dump) {
      return res.status(404).json({ error: 'Dump not found' });
    }

    res.json(dump);
  });
};

/**
 * Process the JSON data and store it in the database
 */
function processJsonData(jsonData, fileName, res) {
  let data;
  try {
    // Parse the JSON data if it's a string
    if (typeof jsonData === 'string') {
      data = JSON.parse(jsonData);
    } else {
      data = jsonData;
    }

    // Validate the data structure
    if (!data.Spiel || !data.Spielrunde || !data.Spieler) {
      return res.status(400).json({ error: 'Invalid JSON structure. Expected Spiel, Spielrunde, and Spieler arrays.' });
    }

    // Store the JSON blob in the dumps table
    db.run(
      'INSERT INTO dumps (filename, content) VALUES (?, ?)',
      [fileName, JSON.stringify(data)],
      function (err) {
        if (err) {
          console.error('Error storing dump:', err);
          return res.status(500).json({ error: 'Error storing dump in database' });
        }

        const dumpId = this.lastID;

        // Insert data into the respective tables
        insertSpielData(data.Spiel, dumpId);
        insertSpielrundeData(data.Spielrunde, dumpId);
        insertSpielerData(data.Spieler, dumpId);

        res.status(201).json({
          message: 'Database dump processed successfully',
          dumpId: dumpId
        });
      }
    );
  } catch (error) {
    console.error('Error processing JSON data:', error);
    res.status(400).json({ error: 'Invalid JSON data: ' + error.message });
  }
}

/**
 * Insert Spiel data into the spiel table
 */
function insertSpielData(spielArray, dumpId) {
  const stmt = db.prepare(`
    INSERT INTO spiel (
      id, dump_id, mandantId, geber, spielorder, score, 
      hasWon, data, startTime, endTime, solo, spielrunde
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  spielArray.forEach(spiel => {
    stmt.run(
      spiel.id, dumpId, spiel.mandantId, spiel.geber, spiel.spielorder, spiel.score,
      spiel.hasWon, spiel.data, spiel.startTime, spiel.endTime, spiel.solo, spiel.spielrunde
    );
  });

  stmt.finalize();
}

/**
 * Insert Spielrunde data into the spielrunde table
 */
function insertSpielrundeData(spielrundeArray, dumpId) {
  const stmt = db.prepare(`
    INSERT INTO spielrunde (
      id, dump_id, mandantId, startTime, endTime, finished,
      comment, spieler, spiele, numSpiele, summen, data
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  spielrundeArray.forEach(spielrunde => {
    stmt.run(
      spielrunde.id, dumpId, spielrunde.mandantId, spielrunde.startTime, spielrunde.endTime, spielrunde.finished,
      spielrunde.comment, spielrunde.spieler, spielrunde.spiele, spielrunde.numSpiele, spielrunde.summen, spielrunde.data
    );
  });

  stmt.finalize();
}

/**
 * Insert Spieler data into the spieler table
 */
function insertSpielerData(spielerArray, dumpId) {
  const stmt = db.prepare(`
    INSERT INTO spieler (
      id, dump_id, mandantId, name, kurzName, initials, data
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  spielerArray.forEach(spieler => {
    stmt.run(
      spieler.id, dumpId, spieler.mandantId, spieler.name, spieler.kurzName, spieler.initials, spieler.data
    );
  });

  stmt.finalize();
} 