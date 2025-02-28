const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const morgan = require('morgan');

// Import routes
const webRoutes = require('./routes/webRoutes');
const apiRoutes = require('./routes/apiRoutes');

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

console.log('Starting server initialization...');

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(morgan('dev')); // Logging
app.use(bodyParser.json({ limit: '50mb' })); // Increased limit for large JSON payloads
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/js', express.static(path.join(__dirname, 'public/wwwroot/js')));
app.use('/css', express.static(path.join(__dirname, 'public/wwwroot/css')));

// Routes
app.use('/', webRoutes);
app.use('/api', apiRoutes);

// Error handling middleware
app.use((req, res, next) => {
  res.status(404).render('error', { message: 'Page not found' });
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).render('error', { message: 'Internal server error' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

console.log('Server initialization complete. Waiting for connections...'); 