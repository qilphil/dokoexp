import express from 'express';
import * as apiController from '../controllers/apiController.js';
import * as webController from '../controllers/webController.js';
import upload from '../config/upload.js';

const router = express.Router();

// Route for uploading JSON data directly via POST request
router.post('/upload/json', apiController.uploadJson);

// Route for uploading JSON file
router.post('/upload/file', upload.single('file'), apiController.uploadFile);

// Route to get all dumps
router.get('/dumps', apiController.getAllDumps);

// Route to get a specific dump by ID
router.get('/dumps/:id', apiController.getDumpById);

// Route to get Spiel data for a specific dump, sorted by Spielrunde and Spielorder
router.get('/dumps/:id/spiel', webController.getSpielData);

export default router; 