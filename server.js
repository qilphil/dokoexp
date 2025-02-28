import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import morgan from 'morgan';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import routes
import webRoutes from './routes/webRoutes.js';
import apiRoutes from './routes/apiRoutes.js';

// Initialize Express app
const app = express();
const port = process.env.PORT || 3012;

console.log('Starting server initialization...');

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware setup
const setupMiddleware = () => {
  // Logging middleware
  app.use(morgan('dev'));

  // Body parsing middleware with increased limits for large JSON payloads
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

  // Static files middleware
  app.use(express.static(path.join(__dirname, 'public')));
  app.use('/js', express.static(path.join(__dirname, 'public/wwwroot/js')));
  app.use('/css', express.static(path.join(__dirname, 'public/wwwroot/css')));

  // Serve Bootstrap files from node_modules
  app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));
};

// Routes setup
const setupRoutes = () => {
  app.use('/', webRoutes);
  app.use('/api', apiRoutes);
};

// Error handling middleware
const setupErrorHandlers = () => {
  // 404 handler - Page not found
  app.use((req, res) => {
    const { method, originalUrl } = req;
    console.log(`404 Not Found: ${method} ${originalUrl}`);
    res.status(404).render('error', {
      message: 'Page not found',
      details: `The requested resource ${originalUrl} was not found on this server.`
    });
  });

  // 500 handler - Server error
  app.use((err, req, res, next) => {
    const { method, originalUrl } = req;
    console.error(`Server error on ${method} ${originalUrl}:`, err);
    res.status(500).render('error', {
      message: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong on the server.'
    });
  });
};

// Initialize the application
const initializeApp = () => {
  setupMiddleware();
  setupRoutes();
  setupErrorHandlers();

  // Start the server
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });

  console.log('Server initialization complete. Waiting for connections...');
};

// Start the application
initializeApp(); 