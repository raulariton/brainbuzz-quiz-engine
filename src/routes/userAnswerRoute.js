import express from 'express';
import { UserAnswerController } from '../controllers/userAnswerController.js';

const router = express.Router();

router.post('/', UserAnswerController.handleAnswerSubmission);

export default router;
