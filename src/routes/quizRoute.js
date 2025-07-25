import { Router } from 'express';
import { QuizController } from '../controllers/quizController.js';

const router = Router();

// GET /quiz
router.get('/', QuizController.handleQuizRequest);

export default router;
