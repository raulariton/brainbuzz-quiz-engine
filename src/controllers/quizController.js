import axios from 'axios'; //pentru ollama
import quizTypes from '../../quizTypes.js';

const ACCEPTED_QUIZ_TYPES = ['historical', 'funny', 'photo', 'caption', 'emoji_puzzle'];

export class QuizController {
  static async handleQuizRequest(req, res) {
    const type = req.query.type;

    if (!type) return res.status(400).json({ error: 'Missing quiz type' });

    if (!ACCEPTED_QUIZ_TYPES.includes(type)) {
      return res.status(400).json({ error: 'Invalid quiz type' });
    }

    try { //luam tipul din quizTypes.js
      let prompt = quizTypes[type].prompt;
      
      //asta ii pentru ca la historical trebuie sa schimbam data
      if (type === 'historical') {
        const currentDate = new Date().toISOString().split('T')[0];
        prompt = prompt.replace('{{currentDate}}', currentDate);
      }

      //request la ollama cu intrebarile
      const ollamaResponse = await axios.post(
        'http://ollama.vsp.dev/api/generate',
        {
          model: 'llama3.1:latest',
          prompt: prompt,
          stream: true
        },
        { responseType: 'stream',
          headers: {
            Authorization: `Bearer ${process.env.OLLAMA_API_KEY}`
        }
         }
      );
      //asta ii textu full de la ollama
      let promptResponse = '';

      //aici se umple/completeaza textu full de la ollama (care vine in bucati)
      ollamaResponse.data.on('data', (chunk) => {
        const lines = chunk.toString().split('\n').filter(Boolean);
        for (const line of lines) {
          try {
            const parsed = JSON.parse(line);
            if (parsed.response) promptResponse += parsed.response;
          } catch (err) {
            console.error('JSON parse failed:', err);
          }
        }
      });
      //convert fulltext in json 

      ollamaResponse.data.on('end', () => {

        let quiz;

        try {
          quiz = JSON.parse(promptResponse);
        } catch (err) {
          quiz = promptResponse.toString()
        }

        res.status(200).json({
          quiz: quiz,
          type: type
        });
      });
      //alte erori
    } catch (err) {
      res.status(500).json({ error: 'Internal server error', details: err.message });
    }
  }
}

