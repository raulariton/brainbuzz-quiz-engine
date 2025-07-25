import { Router } from 'express';
import { QuizController } from '../controllers/quizController.js';

const router = Router();
router.get('/quiz', QuizController.handleQuizRequest);

export default router;
