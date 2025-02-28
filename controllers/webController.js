import dbPromise from '../db.js';

/**
 * Renders the home page with a list of all dumps
 */
export const getHomePage = async (req, res) => {
  try {
    const db = await dbPromise;
    const dumps = await db.all('SELECT id, timestamp, filename FROM dumps ORDER BY timestamp DESC');
    res.render('index', { dumps });
  } catch (error) {
    console.error('Error fetching dumps:', error);
    res.status(500).render('error', { message: 'Error fetching database dumps' });
  }
};

/**
 * Renders the dump details page for a specific dump
 */
export const getDumpDetails = async (req, res) => {
  try {
    const { id: dumpId } = req.params;
    const db = await dbPromise;

    // Get the dump details
    const dump = await db.get('SELECT id, timestamp, filename FROM dumps WHERE id = ?', dumpId);

    if (!dump) {
      return res.status(404).render('error', { message: 'Dump not found' });
    }

    // Get statistics for this dump
    const stats = await db.get(`
      SELECT 
        (SELECT COUNT(*) FROM spiel WHERE dump_id = ?) AS spielCount,
        (SELECT COUNT(*) FROM spielrunde WHERE dump_id = ?) AS spielrundeCount,
        (SELECT COUNT(*) FROM spieler WHERE dump_id = ?) AS spielerCount
    `, [dumpId, dumpId, dumpId]);

    res.render('dump', { dump, stats });
  } catch (error) {
    console.error('Error fetching dump details:', error);
    res.status(500).render('error', { message: `Error fetching dump details: ${error.message}` });
  }
};

/**
 * Gets the Spiel data for a specific dump, sorted by Spielrunde and Spielorder
 */
export const getSpielData = async (req, res) => {
  try {
    const { id: dumpId } = req.params;
    const db = await dbPromise;

    // Get the Spiel data sorted by Spielrunde and Spielorder
    const spielData = await db.all(`
      SELECT * FROM spiel 
      WHERE dump_id = ? 
      ORDER BY spielrunde ASC, spielorder ASC
    `, dumpId);

    if (!spielData || spielData.length === 0) {
      return res.status(404).json({ error: 'No Spiel data found for this dump' });
    }

    res.json(spielData);
  } catch (error) {
    console.error('Error fetching Spiel data:', error);
    res.status(500).json({ error: `Error fetching Spiel data: ${error.message}` });
  }
}; 