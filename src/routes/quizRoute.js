import { Router } from 'express';
import { QuizController } from '../controllers/quizController.js';

const router = Router();

// GET /quiz → returnează quiz + quiz_id
router.get('/', QuizController.handleQuizRequest);
router.get('/quiz/check', QuizController.checkIfUserCompleted);

export default router;
