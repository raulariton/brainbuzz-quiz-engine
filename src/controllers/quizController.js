import axios from 'axios'; //pentru ollama
import quizTypes from '../quizTypes.js';
import { getActiveQuiz, storeQuiz } from '../services/dbServices.js';

const ACCEPTED_QUIZ_TYPES = Object.keys(quizTypes);

export class QuizController {
  static async handleQuizRequest(req, res) {
    const type = req.query.type;
    const duration = Number(req.query.duration) || 15;

    if (!type) return res.status(400).json({ error: 'Missing quiz type' });

    if (!ACCEPTED_QUIZ_TYPES.includes(type)) {
      return res.status(400).json({ error: 'Invalid quiz type' });
    }

    try {
      const active = await getActiveQuiz(type, duration);
      if (active) {
        return res.json({
          quiz_id: active.quiz_id,
          quizText: active.quiz.quizText,
          options: active.quiz.options,
          answer: active.quiz.answer
        });
      }

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
          model: 'magistral:latest',
          prompt: prompt,
          stream: true,
          think: false
        },
        {
          responseType: 'stream',
          headers: {
            Authorization: `Bearer ${process.env.OLLAMA_API_KEY}`
          }
        }
      );

      // empty string to store the full response
      let promptResponse = '';

      // get stream data from ollama response
      ollamaResponse.data.on('data', (chunk) => {
        for (const line of chunk.toString().split('\n').filter(Boolean)) {
          try {
            const parsed = JSON.parse(line);
            if (parsed.response) promptResponse += parsed.response;
          } catch { }
        }
      });

      // convert fulltext in json
      ollamaResponse.data.on('end', async () => {
        const match = promptResponse.match(
          /\{\s*"quizText"\s*:\s*".+?",\s*"options"\s*:\s*\[.*?\],\s*"(answer|correctAnswer)"\s*:\s*".*?"\s*\}/s
        );

        if (!match) {
          console.error('❌ No valid quiz JSON:', promptResponse);
          return res.status(500).json({ error: 'No valid quiz JSON found.' });
        }

        let quiz = JSON.parse(match[0]);

        // fix naming of the answer field
        //  sometimes the LLM returns "answer" and sometimes "correctAnswer"
        if (quiz.correctAnswer && !quiz.answer) {
          quiz.answer = quiz.correctAnswer;

          // delete the correctAnswer field from quiz object
          delete quiz.correctAnswer;
        }

        const quizId = await storeQuiz({ type, quiz, duration });

        return res.json({
          quiz_id: quizId,
          quizText: quiz.quizText,
          options: quiz.options,
          answer: quiz.answer
        });
      });

    } catch (err) {
      console.error('❌ handleQuizRequest error:', err);
      return res.status(500).json(
        { error: 'Internal server error', details: err.message }
      );
    }
  }

}
