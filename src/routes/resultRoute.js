import express from 'express';
import { ResultsController } from '../controllers/resultsController.js';

const router = express.Router();

// POST /results
router.post('/', ResultsController.handleResults);

export default router;
