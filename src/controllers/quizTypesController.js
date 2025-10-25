import { getQuizTypes } from '../services/dbServices.js';

export class QuizTypesController {
  static async handleQuizTypesRequest(req, res) {
    const lang = req.query.lang || 'en';

    try {
      const quizTypes = await getQuizTypes(lang)

      return res.json({ quizTypes });

    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch quiz types', details: error.message });
    }
  }
}