import { storeUserAnswer } from '../services/dbServices.js';

export class UserAnswerController {
  static async handleAnswerSubmission(req, res) {
    const { user_id, quiz_id, correct } = req.body;

    if (!user_id || !quiz_id || typeof correct === 'undefined') {
      return res.status(400).json({ error: 'Missing fields' });
    }

    try {
      await storeUserAnswer({ user_id, quiz_id, correct });
      res.status(201).json({ message: 'Answer saved' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save answer', details: error.message });
    }
  }
}
