import express from 'express';
import { handleResults } from '../controllers/resultsController.js';

const router = express.Router();

router.post('/results', handleResults);

export default router;
