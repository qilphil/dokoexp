import express from 'express';
import * as webController from '../controllers/webController.js';

const router = express.Router();

// Home page - shows list of all dumps
router.get('/', webController.getHomePage);

// View details of a specific dump
router.get('/dumps/:id', webController.getDumpDetails);

export default router; 