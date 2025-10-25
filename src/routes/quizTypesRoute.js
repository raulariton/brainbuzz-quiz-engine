import { Router } from 'express';
import { QuizTypesController } from '../controllers/quizTypesController.js';

const router = Router();

// GET /quiz-types returns a list of available quiz types in specified locale
router.get('/', QuizTypesController.handleQuizTypesRequest);

export default router;