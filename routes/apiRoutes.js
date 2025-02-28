const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');
const upload = require('../config/upload');

// Handle direct JSON data upload
router.post('/upload', apiController.uploadJson);

// Handle file uploads
router.post('/upload/file', upload.single('file'), apiController.uploadFile);

// Get all dumps
router.get('/dumps', apiController.getAllDumps);

// Get a specific dump
router.get('/dumps/:id', apiController.getDumpById);

module.exports = router; 