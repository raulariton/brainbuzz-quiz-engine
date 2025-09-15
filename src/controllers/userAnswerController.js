import { storeUserAnswer } from '../services/dbServices.js';
import logger from '../utils/logger.js';

export class UserAnswerController {
  static async handleAnswerSubmission(req, res) {
    const { user_id, quiz_id, correct, user_data } = req.body;

    // Validare date (acceptăm dacă poza lipsește, dar numele trebuie să fie prezent)
    if (!user_id || !quiz_id || typeof correct === 'undefined' || !user_data?.display_name) {
      return res.status(400).json({ error: 'Missing or invalid fields' });
    }

    // Dacă userul nu are poză, folosim un fallback
    const finalUserData = {
      display_name: user_data.display_name,
      profile_picture_url:
        user_data.profile_picture_url ||
        'https://cdn-icons-png.flaticon.com/512/847/847969.png', // default avatar
    };

    try {
      const { user_answer_id, updated_answers } = await storeUserAnswer({
        user_id,
        quiz_id,
        correct,
        user_data: finalUserData,
      });

      res.status(201).json({
        message: 'Answer saved',
        user_answer_id,
        total_answers: updated_answers,
      });
    } catch (error) {
      logger.error('Error submitting user answer: ', error.message);
      res.status(500).json({ error: 'Failed to save answer', details: error.message });
    }
  }
}
