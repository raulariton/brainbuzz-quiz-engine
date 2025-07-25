import axios from 'axios'; //pentru ollama
import quizTypes from '../quizTypes.js';
import { storeQuiz } from '../services/dbServices.js';

const ACCEPTED_QUIZ_TYPES = ['historical', 'icebreaker', 'movie_quote'];

export class QuizController {
  static async handleQuizRequest(req, res) {
    const type = req.query.type;

    if (!type) return res.status(400).json({ error: 'Missing quiz type' });

    if (!ACCEPTED_QUIZ_TYPES.includes(type)) {
      return res.status(400).json({ error: 'Invalid quiz type' });
    }

    try {
      // get prompt from quizTypes based on type
      let prompt = quizTypes[type].prompt;

      // if the type is 'historical',
      // replace the {{currentDate}} placeholder with the current date
      if (type === 'historical') {
        const currentDate = new Date().toISOString().split('T')[0];
        prompt = prompt.replace('{{currentDate}}', currentDate);
      }

      // ollama request with the requested prompt
      const ollamaResponse = await axios.post(
        'http://ollama.vsp.dev/api/generate',
        {
          model: 'llama3.1:latest',
          prompt: prompt,
          stream: false
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OLLAMA_API_KEY}`
          }
        }
      );

      // empty string to store the full response
      let promptResponse = '';

      const quizResponse = response.data.response;

      let quizJSON;

      try {
        quizJSON = JSON.parse(quizResponse);
      } catch (err) {
        quizJSON = quizResponse.toString();
      }

      // store quiz in database
      const quizContent = {
        type: type,
        content: quiz
      };

      res.status(200).json({
        quiz: quizJSON,
        type: type
      });

    } catch (err) {
      // other errors
      res.status(500).json({ error: 'Internal server error', details: err.message });
    }
  }
}
