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
          stream: true
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
        const lines = chunk.toString().split('\n').filter(Boolean);
        for (const line of lines) {
          try {
            const parsed = JSON.parse(line);
            if (parsed.response) promptResponse += parsed.response;
          } catch (err) {
            //console.error('JSON parse failed:', err);
          }
        }
      });

      // convert fulltext in json
      ollamaResponse.data.on('end', async () => {
        let quiz;
        try {

          const match = promptResponse.match(/\{\s*"quizText"\s*:\s*".+?",\s*"options"\s*:\s*\[.*?\],\s*"(answer|correctAnswer)"\s*:\s*".*?"\s*\}/s);

          if (!match) {
            console.error("❌ Nu am găsit niciun quiz JSON valid în răspunsul LLM:");
            console.error(promptResponse);

            // NOTE: quiz engine ar trebui sa incerce sa genereze quiz-uri pana
            //  unul valid este generat
            return res.status(500).json({ error: "No valid quiz JSON found." });
          }

          quiz = JSON.parse(match[0]);


          // fix naming of the answer field
          //  sometimes the LLM returns "answer" and sometimes "correctAnswer"
          if (quiz.correctAnswer && !quiz.answer) {
            quiz.answer = quiz.correctAnswer;

            // delete the correctAnswer field from quiz object
            delete quiz.correctAnswer;
          }

        const quizId = await storeQuiz({ type, content: quiz });

        // Trimit quiz-ul împreună cu id-ul către Slackbot
        res.json({
          quiz_id: quizId,
          quizText: quiz.quizText,
          options: quiz.options,
          answer: quiz.answer
        });
      } catch (error) {
        console.error("❌ Eroare la parsarea quiz-ului:", error);
        console.error("Prompt response complet:", promptResponse);
        res.status(500).json({ error: "Failed to parse quiz" });
      }
    });


    } catch (err) {
      // other errors
      res.status(500).json({ error: 'Internal server error', details: err.message });
    }
  }
}
