import { Router } from 'express';
import { TestController } from '../controllers/testController.js';

const router = Router();
router.get('/', TestController.getTest);

export default router;
