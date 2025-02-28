const db = require('../db');

/**
 * Renders the home page with a list of all dumps
 */
exports.getHomePage = (req, res) => {
  db.all('SELECT id, timestamp, filename FROM dumps ORDER BY timestamp DESC', (err, dumps) => {
    if (err) {
      console.error('Error fetching dumps:', err);
      return res.status(500).render('error', { message: 'Error fetching database dumps' });
    }
    res.render('index', { dumps });
  });
};

/**
 * Renders the dump details page for a specific dump
 */
exports.getDumpDetails = (req, res) => {
  const dumpId = req.params.id;

  // Get the dump details
  db.get('SELECT id, timestamp, filename FROM dumps WHERE id = ?', [dumpId], (err, dump) => {
    if (err || !dump) {
      console.error('Error fetching dump:', err);
      return res.status(404).render('error', { message: 'Dump not found' });
    }

    // Get statistics for this dump
    db.all(`
      SELECT 
        (SELECT COUNT(*) FROM spiel WHERE dump_id = ?) AS spielCount,
        (SELECT COUNT(*) FROM spielrunde WHERE dump_id = ?) AS spielrundeCount,
        (SELECT COUNT(*) FROM spieler WHERE dump_id = ?) AS spielerCount
    `, [dumpId, dumpId, dumpId], (err, stats) => {
      if (err) {
        console.error('Error fetching stats:', err);
        return res.status(500).render('error', { message: 'Error fetching statistics' });
      }

      res.render('dump', { dump, stats: stats[0] });
    });
  });
}; 