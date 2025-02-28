const express = require('express');
const router = express.Router();
const webController = require('../controllers/webController');

// Home page - shows the web interface with list of dumps
router.get('/', webController.getHomePage);

// View a specific dump
router.get('/dumps/:id', webController.getDumpDetails);

module.exports = router; 