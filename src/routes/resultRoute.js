import express from 'express';
import { handleResults } from '../controllers/resultsController.js';

const router = express.Router();

// POST /results
router.post('/', handleResults);

export default router;
